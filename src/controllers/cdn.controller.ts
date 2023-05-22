import { Request, Response } from 'express';
import { File } from '../models/file.model';
import fileUtil from '../utils/file.util';
import Stream from 'node:stream';
import mime from 'mime-types';
import exitCodes from '../utils/exit-codes.util';

async function fetchFile(req: Request, res: Response) {
    let id = Number(req.params.id);
    let fileName = String(req.params.fileName);

    let nameExt = fileUtil.validateFileName(fileName);
    if(!nameExt) {
        return res.status(404).json({
            code: exitCodes.NOT_FOUND,
            message: 'File not found.',
        });
    }

    let file = await File.findOne({
        where: {
            id,
            name: nameExt.name,
            extension: nameExt.extension,
        }
    });

    let mimeType = mime.contentType(nameExt.extension);
    if(!file || !mimeType) {
        return res.status(404).json({
            code: exitCodes.NOT_FOUND,
            message: 'File not found.',
        });
    }

    res.setHeader('content-type', mimeType);
    Stream.Readable.from(file.data).pipe(res);
};


export default {
    fetchFile,
};