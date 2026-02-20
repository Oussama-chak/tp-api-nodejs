// Importer Express et créer un routeur
const express = require('express');
const router = express.Router();

// Importer toutes les fonctions du contrôleur
const {
    getAllEtudiants,
    getEtudiantById,
    createEtudiant,
    updateEtudiant,
    deleteEtudiant,
    getEtudiantsByFiliere,
    searchEtudiants,
    getDisabledEtudiants
} = require('../controllers/EtudiantController');

// ============================================
// DÉFINITION DES ROUTES
// ============================================

// Route:  /api/etudiants
// GET  → Liste tous les étudiants
// POST → Crée un nouvel étudiant
router.route('/')
    .get(getAllEtudiants)
    .post(createEtudiant);

// ⚠️ IMPORTANT:  Cette route DOIT être avant /: id
// Sinon "filiere" serait interprété comme un ID
router.get('/filiere/:filiere', getEtudiantsByFiliere);
// Route de recherche par nom ou prénom (ex: /api/etudiants/search?q=ahmed)
router.get('/search', searchEtudiants);
// Voir les étudiants désactivés
router.get('/disabled', getDisabledEtudiants);

// Route: /api/etudiants/:id
// GET    → Récupère un étudiant par ID
// PUT    → Modifie un étudiant
// DELETE → Supprime un étudiant
router.route('/:id')
    .get(getEtudiantById)
    .put(updateEtudiant)
    .delete(deleteEtudiant);

// Exporter le routeur
module.exports = router;