import { Cities, ICity } from '../models/cities.model';

export class CityRespository {
    async getCities(): Promise<ICity[]> {
        return (await Cities.find({}, { name: 1, _id: 0 }));
    };
};
