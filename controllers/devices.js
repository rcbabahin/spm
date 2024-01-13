export const handleGetAllDevices = (db) => (req, res) => {
    db.select('*').from('devices')
    .then(devices => {
        res.json(devices)
    })
    .catch(err => res.status(400).json('Error getting all devices'))
}

export const handleGetDeviceById = (db) => (req, res) => {
    const { id } = req.params;

    db.select('*').from('devices').where({ id })
        .then(device => {
            if (device.length) {
                res.json(device[0]);
            } else {
                res.status(400).json('Not found');
            }
        })
        .catch(err => res.status(400).json('Error getting device'))
}

export const handleDeleteDevice = (db) => (req, res) => {
    const { id } = req.params;
    
    db.transaction(trx => {
        trx.del()
        .from('measurements')
        .where('device_id', '=', id)
        .returning('device_id')
        .then(data => {  
            return trx
                .del()
                .from('devices')
                .where('id', '=', data[0].device_id)
                .returning('id')
                .then(data => res.json(data[0].id))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('Error deleting device'))
}

export const handleUpdateDevice = (db) => (req, res) => {
    const { id } = req.params;
    const { name, company, category, size, measurements } = req.body;
    
    db.transaction(trx => {
        trx
        .update({ name, company, category, size })
        .from('devices')
        .where('id', '=', id)
        .returning('id')
        .then(async data => {
            try {
                await trx('measurements').where('device_id', data[0].id).del();

                for (const m of measurements) {
                    await trx('measurements').insert({ device_id: data[0].id, ...m });
                }

                res.json(data[0].id);

                return trx.commit();
            } catch (error) {
                throw error;
            }
            
        })
        .catch(trx.rollback)
    })
    .catch(err => { console.log(err);  res.status(400).json('Error updating device')})
}