export interface IPropietarioService {
    create(data: any): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: number): Promise<any>;
    update(id: number, data: any): Promise<any>;
    remove(id: number): Promise<void>;
}