const mysql = require('mysql')
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '******',
    database: 'Register'
})

const fs = require('fs')
const writable = fs.createWriteStream('persons.csv')

writable.write('id,name,birth_day,career\n', () => {
    connection.connect(err => {
        const query = connection.query('SELECT * FROM PERSONS')
        query.on('result', row => {
            // Pausa a conexão com database devido muito dados
            connection.pause()
            writeFile(row)
        })
        query.on('end', () => {
            writable.end()
            connection.end()
            console.log('Finished')
        })
    })
})

const writeFile = csv => {
    const data = `${csv.id},${csv.name},${csv.birth_day},${csv.career}\n`
    writable.write(data, () => {
        connection.resume()
    })
}