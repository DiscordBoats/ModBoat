import { CaseSettingBase as Base } from './SettingsBase';
import model, { CaseModel } from '../../models/CaseSchema';
import { PunishmentOptions } from '../managers/PunishmentManager';

export default class CaseSettings implements Base<CaseModel> {
    
    public model = model;

    async get(guild: string, id: number) {
        const document = await this.model.findOne({ guild, id }).exec();
        if (!document || document === null) return null;
        return document;
    }

    async create(guild: string, moderator: string, type: string, user: string, options: PunishmentOptions, reason?: string) {
        const newest = await this.model.find({guild}).sort('-id').exec();
        const query = new this.model({
            guild,
            moderator,
            type,
            victim: user,
            reason,
            id: !!newest[0] ? newest[0].id + 1 : 1,
            temp: options.temp,
            soft: options.soft
        });
        query.save();
        return query;
    }

    async getAll(guild: string) {
        return await this.model.find({guild});
    }

    remove(guild: string, id: number) {
        return this.model.findOne({ guild, id }).remove().exec();
    }

    update(guild: string, id: number, doc: { [x: string]: any }, cb: (error: any, raw: any) => void) {
        return this.model.updateOne({ guild, id }, doc, cb);
    }
}