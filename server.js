import express from 'express';
import GamesRoutes from './routes/games.js';
import JudgesRoutes from './routes/judges.js';
import VotesRoutes from './routes/votes.js';
import AdminsRoutes from './routes/admins.js';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(2024, function(){
    console.log('El servidor está levantado: http://localhost:2024')
});

app.use(GamesRoutes);
app.use(JudgesRoutes);
app.use(VotesRoutes);
app.use(AdminsRoutes);
app.use(express.static('public')); 

app.use(function(err, req, res, next) {
    console.error('Error completo:', err);
    res.status(500).send('Something broke!');
  });

