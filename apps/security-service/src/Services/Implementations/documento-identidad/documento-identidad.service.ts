import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DocumentoIdentidad,
  TipoDocumento,
} from '../../../entities/DocumentoIdentidad';
import {
  IDocumentoIdentidadService,
  CreateDocumentoIdentidadDto,
  UpdateDocumentoIdentidadDto,
  DocumentoIdentidadQuery,
} from '../../Interfaces/documento-identidad/idocumento-identidad.service';

@Injectable()
export class DocumentoIdentidadService implements IDocumentoIdentidadService {
  constructor(
    @InjectRepository(DocumentoIdentidad)
    private readonly documentoRepository: Repository<DocumentoIdentidad>,
  ) {}

  async create(data: CreateDocumentoIdentidadDto): Promise<DocumentoIdentidad> {
    const existingDoc = await this.documentoRepository.findOne({
      where: {
        tipo: data.tipo,
        numero: data.numero,
      },
    });

    if (existingDoc) {
      throw new ConflictException(
        'Ya existe un documento con el mismo tipo y número',
      );
    }

    const documento = this.documentoRepository.create({
      ...data,
      paisEmision: data.paisEmision || 'PE',
      validado: data.validado ?? false,
    });

    return await this.documentoRepository.save(documento);
  }

  async findAll(query: DocumentoIdentidadQuery = {}): Promise<{
    documentos: DocumentoIdentidad[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { page = 1, limit = 10, tipo, numero, validado, paisEmision } = query;

    const queryBuilder =
      this.documentoRepository.createQueryBuilder('documento');

    if (tipo) {
      queryBuilder.andWhere('documento.tipo = :tipo', { tipo });
    }

    if (numero) {
      queryBuilder.andWhere('documento.numero ILIKE :numero', {
        numero: `%${numero}%`,
      });
    }

    if (validado !== undefined) {
      queryBuilder.andWhere('documento.validado = :validado', { validado });
    }

    if (paisEmision) {
      queryBuilder.andWhere('documento.paisEmision = :paisEmision', {
        paisEmision,
      });
    }

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    queryBuilder.orderBy('documento.createdAt', 'DESC');

    const [documentos, total] = await queryBuilder.getManyAndCount();
    const totalPages = Math.ceil(total / limit);

    return { documentos, total, page, totalPages };
  }

  async findOne(id: string): Promise<DocumentoIdentidad> {
    const documento = await this.documentoRepository.findOne({
      where: { id: id },
    });

    if (!documento) {
      throw new NotFoundException('Documento de identidad no encontrado');
    }

    return documento;
  }

  async findByTipoAndNumero(
    tipo: TipoDocumento,
    numero: string,
  ): Promise<DocumentoIdentidad> {
    const documento = await this.documentoRepository.findOne({
      where: { tipo, numero },
    });

    if (!documento) {
      throw new NotFoundException('Documento de identidad no encontrado');
    }

    return documento;
  }

  async update(
    id: string,
    data: UpdateDocumentoIdentidadDto,
  ): Promise<DocumentoIdentidad> {
    const documento = await this.findOne(id);

    if (
      (data.tipo && data.tipo !== documento.tipo) ||
      (data.numero && data.numero !== documento.numero)
    ) {
      const existingDoc = await this.documentoRepository.findOne({
        where: {
          tipo: data.tipo || documento.tipo,
          numero: data.numero || documento.numero,
        },
      });

      if (existingDoc && existingDoc.id !== id) {
        throw new ConflictException(
          'Ya existe un documento con el mismo tipo y número',
        );
      }
    }

    Object.assign(documento, data);
    documento.updatedAt = new Date();

    return await this.documentoRepository.save(documento);
  }

  async remove(id: string): Promise<void> {
    const documento = await this.findOne(id);
    await this.documentoRepository.remove(documento);
  }

  async validateDocument(id: string): Promise<DocumentoIdentidad> {
    const documento = await this.findOne(id);
    documento.validado = true;
    documento.fechaValidacion = new Date();
    documento.updatedAt = new Date();

    return await this.documentoRepository.save(documento);
  }

  async findPendingValidation(): Promise<DocumentoIdentidad[]> {
    return await this.documentoRepository.find({
      where: { validado: false },
      order: { createdAt: 'ASC' },
    });
  }
}
