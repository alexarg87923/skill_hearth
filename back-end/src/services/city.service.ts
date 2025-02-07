import { CityRespository } from '../repositories/cities.repository';
import { ICity } from '../models/cities.model';

export class CityService {
    private cityRepository: CityRespository;

    constructor() {
        this.cityRepository = new CityRespository();
    };

    async get_cities(): Promise<ICity[] | null | undefined> {
        return (await this.cityRepository.getCities());
    };
};