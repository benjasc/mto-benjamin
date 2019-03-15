import { SubItem } from './../../shared/vo/subitem';

export class MenuProfile {
    idModule: number;
    name: string;
    status: number;
    url: string;

    idAccess: number;
    creationdate: string;
    accessName: string;

    subItems: SubItem[];

}
