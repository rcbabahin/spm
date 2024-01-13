export const handleRegister = (db) => (req, res) => {
    const { name, company, category, size, measurements } = req.body;
    
    if (!name || !company || !category || !measurements || !size)
        return res.status(400).json('Incorrect form submition')
    
    db.transaction(trx => {
        trx.insert({
            name,
            company,
            category,
            size
        })
        .into('devices')
        .returning('id')
        .then(device_id => {
            const meas = measurements.map(m => {
                m.device_id = device_id[0].id;
                
                return m;
            })

            return trx('measurements').returning('*')
            .insert(meas)
            .then(data => res.json(data[0].device_id))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => res.status(400).json('unable to register new device'))
}
