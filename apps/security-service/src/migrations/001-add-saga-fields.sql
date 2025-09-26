-- ============================================================================
-- MIGRACIÓN PARA AÑADIR CAMPOS DEL PATRÓN SAGA
-- Ejecutar en el esquema: auth_security
-- ============================================================================

-- =========== AÑADIR CAMPOS AL USUARIO ===========
-- Campos para tracking del estado del trabajador en el saga
ALTER TABLE auth_security.usuario
ADD COLUMN IF NOT EXISTS estado_trabajador VARCHAR(20) DEFAULT 'none'
  CHECK (estado_trabajador IN ('none', 'pending', 'created', 'failed'));

ALTER TABLE auth_security.usuario
ADD COLUMN IF NOT EXISTS trabajador_id UUID NULL;

-- =========== CREAR TABLA SOLICITUD_TRABAJADOR ===========
-- Tabla para tracking de solicitudes de trabajador (patrón saga)
CREATE TABLE IF NOT EXISTS auth_security.solicitud_trabajador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES auth_security.usuario(id),
    trabajador_data TEXT NOT NULL, -- JSON serializado
    estado VARCHAR(30) NOT NULL DEFAULT 'pending'
      CHECK (estado IN (
        'pending',
        'processing',
        'completed',
        'failed',
        'retry_scheduled',
        'compensation_completed',
        'manual_review_required'
      )),
    intentos INTEGER NOT NULL DEFAULT 0,
    trabajador_id UUID NULL,
    error_message TEXT NULL,
    next_retry_at TIMESTAMP WITH TIME ZONE NULL,
    timeout_at TIMESTAMP WITH TIME ZONE NULL,
    completed_at TIMESTAMP WITH TIME ZONE NULL,
    compensated_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========== ÍNDICES PARA PERFORMANCE ===========
-- Índices para mejorar las consultas del saga
CREATE INDEX IF NOT EXISTS idx_solicitud_trabajador_usuario_id
  ON auth_security.solicitud_trabajador(usuario_id);

CREATE INDEX IF NOT EXISTS idx_solicitud_trabajador_estado
  ON auth_security.solicitud_trabajador(estado);

CREATE INDEX IF NOT EXISTS idx_solicitud_trabajador_timeout
  ON auth_security.solicitud_trabajador(timeout_at)
  WHERE estado IN ('pending', 'processing', 'retry_scheduled');

CREATE INDEX IF NOT EXISTS idx_usuario_estado_trabajador
  ON auth_security.usuario(estado_trabajador)
  WHERE estado_trabajador != 'none';

-- =========== TRIGGER PARA UPDATED_AT ===========
-- Trigger automático para actualizar updated_at
CREATE OR REPLACE FUNCTION auth_security.update_solicitud_trabajador_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_solicitud_trabajador_updated_at
    BEFORE UPDATE ON auth_security.solicitud_trabajador
    FOR EACH ROW
    EXECUTE FUNCTION auth_security.update_solicitud_trabajador_updated_at();

-- =========== COMENTARIOS PARA DOCUMENTACIÓN ===========
COMMENT ON TABLE auth_security.solicitud_trabajador IS
  'Tabla para tracking de solicitudes de trabajador en el patrón Saga';

COMMENT ON COLUMN auth_security.solicitud_trabajador.trabajador_data IS
  'Datos del trabajador serializados como JSON para poder recrear la solicitud';

COMMENT ON COLUMN auth_security.solicitud_trabajador.estado IS
  'Estado del proceso saga: pending, processing, completed, failed, etc.';

COMMENT ON COLUMN auth_security.usuario.estado_trabajador IS
  'Estado del trabajador asociado: none, pending, created, failed';