const express = require('express')

const express_layout = require('express-ejs-layouts')

const app = express()

// the middleware 
app.use(express_layout)
app.set('view engine', 'ejs')

// routes
app.use('/', require('./Routes/index'))
app.use('/users', require('./Routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running...'))
