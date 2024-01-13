export const handleGetAllMeasurements = (db) => (req, res) => {
    db.select('*').from('devices')
        .then(async devices => {
            const retval = [];
            
            try {
                for(let i = 0; i < devices.length; i++) {
                    try {
                        const meas =  await db.select('*').from('measurements').where('device_id', '=', devices[i].id);
                    
                        retval.push({ id: devices[i].id, items: [] })
        
                        meas.forEach(element => {
                            delete element.device_id;
                            retval[i].items.push(element);
                        });
                    }
                    catch(e) {
                        console.error(e);
                        res.status(400).json('Error getting measurements')
                    }
                }
                
                res.json(retval);
            }
            catch (e) {
                console.error(e);
                res.status(400).json('Error getting measurements')
            }

        })
        .catch(err => res.status(400).json('Error getting devices for measurements'))
}

export const handleGetMeasurementById = (db) => (req, res) => {
    const { id } = req.params;

    db.select('*').from('measurements').where('device_id', '=', id)
    .then(measurement => {
        if (measurement.length) {
            const retval = { id, items: [] };

            measurement.forEach(element => {
                delete element.device_id;
                retval.items.push(element);
            });
            res.json(retval);
        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting measurement by id'))
}