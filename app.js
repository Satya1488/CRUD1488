const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const {open} = require('sqlite');
app.use(express.json());

const db = new sqlite3.Database('./data.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

/*db.serialize(() => {
    db.run(`CREATE TABLE customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        age INT,
        phone INT,
        email VARCHAR(255),
        created_on DATE,
        updated_on DATE,
        address_id INT,
        FOREIGN KEY (address_id) REFERENCES address(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        } else {
            console.log('Table "employees" created successfully.');
        }
    });
}); */

/* const insertData = (id,name,age,phone,email,created_on,updated_on,address_id) => {
    const sql = `INSERT INTO customers (id,name,age,phone,email,created_on,updated_on,address_id) VALUES (?,?,?,?,?,?,?,?)`;
    db.run(sql, [id,name,age,phone,email,created_on,updated_on,address_id], (err) => {
        if (err) {
            console.error('Error inserting data', err.message);
        } else {
            console.log(`Data inserted successfully.`);
        }
    });
};

const userData = [
    { name:'Ravi',age:21,phone:123456,email: 'ravi@example.com',created_on:'2020-1-23',updated_on:'2021-3-21',address_id:1},
    { name:'Ram',age:22,phone:12345633,email: 'ram@example.com',created_on:'2021-2-24',updated_on:'2023-2-26',address_id:2}
];

userData.forEach((user) => {
    insertData(user.id,user.name,user.age,user.phone,user.email,user.created_on,user.updated_on,user.address_id);
}); */

/*db.serialize(() => {
    db.run(`CREATE TABLE address (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lane VARCHAR(255),
        country VARCHAR(255),
        city VARCHAR(255),
        pincode INT,
        updated_on DATE
    )`, (err) => {
        if (err) {
            console.error('Error creating table', err.message);
        } else {
            console.log('Table "address" created successfully.');
        }
    });
}); */

/*const insertAddressData = (id,lane,country,city,pincode,updated_on) => {
    const sql = `INSERT INTO address (id,lane,country,city,pincode,updated_on) VALUES (?,?,?,?,?,?)`;
    db.run(sql, [id,lane,country,city,pincode,updated_on], (err) => {
        if (err) {
            console.error('Error inserting data', err.message);
        } else {
            console.log(`Data inserted successfully.`);
        }
    });
};


const addressData = [
    { lane:'street',country:'India',city:"Mumbai",pincode:123456,updated_on:'2021-3-21'},
    { lane:'street1',country:'Japan',city:"Tokyo",pincode:12333456,updated_on:'2022-3-21'}
];


addressData.forEach((user) => {
    insertAddressData(user.id,user.lane,user.country,user.city,user.pincode,user.updated_on);
}); */


// Customer Details 

app.get('/customers/', async (req, res) => {

        db.all('SELECT * FROM customers', (err, rows) => {
        if (err) {
            console.error('Error retrieving data', err.message);
            res.status(500).send('Internal Server Error');
        } else {        
            res.json(rows);
        }
    });
})


// Address Details

app.get('/address/', async (req, res) => {

    db.all('SELECT * FROM address', (err, rows) => {
    if (err) {
        console.error('Error retrieving data', err.message);
        res.status(500).send('Internal Server Error');
    } else {        
        res.json(rows);
    }
});
})

// Customer 

app.get('/customers/:id', (req, res) => {
    const entryId = req.params.id;

    db.get('SELECT * FROM customers WHERE id = ?', [entryId], (err, row) => {
        if (err) {
            console.error('Error retrieving data', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Entry not found' });
        } else {
            
            res.json(row);
        }
    });
});

// Address 
app.get('/address/:id', (req, res) => {
    const entryId = req.params.id;

    db.get('SELECT * FROM address WHERE id = ?', [entryId], (err, row) => {
        if (err) {
            console.error('Error retrieving data', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else if (!row) {
            res.status(404).json({ error: 'Entry not found' });
        } else {      
            res.json(row);
        }
    });
});

// Delete Customer 

app.delete('/customers/:id', async (req, res) => {
    const {id} = req.params;
    const query = `DELETE FROM customers WHERE id=${id}`;
    await db.run(query);
    res.send('deleted successfully');
}) 

// Customer Post

app.post('/customers/', async (req, res) => {

    const details = req.body
    const {name,age,phone,email,created_on,updated_on,address_id} = details ;

    const addQuery = `INSERT INTO customers(name,age,phone,email,created_on,updated_on,address_id)
    VALUES ('${name}', ${age}, ${phone}, '${email}', '${created_on}', '${updated_on}', ${address_id});
    `;

    const dbResponse = await db.run(addQuery);
    res.send(dbResponse);
})

//join 

app.get('/customers/:id', async(req, res) => {
    const {id} = req.params;

    const query = `SELECT * FROM customers JOIN address on 
    customers.address_id = address.id WHERE id=${id}
    `;

    const response = await db.get(query);
    const data = await response.json();
    res.send(data);
})

// Update 

app.put('/customers/:id', async (req, res) => {
    const {id} = req.params; 
    const details = req.body;
    const {name,age,phone,email,created_on,updated_on,address_id} = details;
    const updateQuery = `UPDATE customers SET
    name = '${name}',
    age = '${age}',
    phone = '${phone}',
    email = '${email}',
    created_on = '${created_on}',
    updated_on = '${updated_on}',
    address_id = ${address_id}
    WHERE id = ${id}`;

    await db.run(updateQuery);
    res.send('Updated Successfully');
})
