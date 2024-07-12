// fileUtils.js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');

export const readDataFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(dataFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

export const writeDataFile = (data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const appendDataFile = async (newData) => {
    try {
        const data = await readDataFile();
        data.push(...newData);
        await writeDataFile(data);
    } catch (error) {
        console.error('Error appending to data file:', error);
    }
};