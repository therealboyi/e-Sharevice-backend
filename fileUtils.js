// fileUtils.js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data.json');
const reservedFilePath = path.join(process.cwd(), 'reserved.json');

const ensureFileExists = (filePath) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '[]', 'utf8');
    }
};

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

export const readReservedFile = () => {
    ensureFileExists(reservedFilePath);
    return new Promise((resolve, reject) => {
        fs.readFile(reservedFilePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

export const writeReservedFile = (data) => {
    ensureFileExists(reservedFilePath);
    return new Promise((resolve, reject) => {
        fs.writeFile(reservedFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const appendReservedFile = async (newData) => {
    ensureFileExists(reservedFilePath);
    try {
        const data = await readReservedFile();
        data.push(newData);
        await writeReservedFile(data);
    } catch (error) {
        console.error('Error appending to reserved file:', error);
    }
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