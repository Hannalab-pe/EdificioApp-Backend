import { DocumentoIdentidad, TipoDocumento } from '../../../entities/DocumentoIdentidad';

export interface CreateDocumentoIdentidadDto {
    tipo: TipoDocumento;
    numero: string;
    paisEmision?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    validado?: boolean;
}

export interface UpdateDocumentoIdentidadDto {
    tipo?: TipoDocumento;
    numero?: string;
    paisEmision?: string;
    fechaEmision?: string;
    fechaVencimiento?: string;
    validado?: boolean;
    fechaValidacion?: Date;
}

export interface DocumentoIdentidadQuery {
    page?: number;
    limit?: number;
    tipo?: TipoDocumento;
    numero?: string;
    validado?: boolean;
    paisEmision?: string;
}

export interface IDocumentoIdentidadService {
    create(data: CreateDocumentoIdentidadDto): Promise<DocumentoIdentidad>;
    findAll(query?: DocumentoIdentidadQuery): Promise<{ documentos: DocumentoIdentidad[], total: number, page: number, totalPages: number }>;
    findOne(id: string): Promise<DocumentoIdentidad>;
    findByTipoAndNumero(tipo: TipoDocumento, numero: string): Promise<DocumentoIdentidad>;
    update(id: string, data: UpdateDocumentoIdentidadDto): Promise<DocumentoIdentidad>;
    remove(id: string): Promise<void>;
    validateDocument(id: string): Promise<DocumentoIdentidad>;
    findPendingValidation(): Promise<DocumentoIdentidad[]>;
}