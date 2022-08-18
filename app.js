const express = require('express')

const express_layout = require('express-ejs-layouts')

const app = express()

// static files
// app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))

// the middleware
app.use(express_layout)
app.set('view engine', 'ejs')

// routes
app.use('/', require('./Routes/index'))
app.use('/users', require('./Routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log('server running...'))
