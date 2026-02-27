const Etudiant = require('../models/Etudiant');


exports.createEtudiant = async (req, res) => {
    try {
       
        console.log('📥 Données reçues:', req.body);
        
        const { nom, prenom } = req.body;
        if (nom && prenom) {
            const existing = await Etudiant.findOne({ nom: nom, prenom: prenom });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: 'Un étudiant avec le même nom et prénom existe déjà'
                });
            }
        }

        const etudiant = await Etudiant.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Étudiant créé avec succès',
            data: etudiant
        });
        
    } catch (error) {
        
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Cet email existe déjà'
            });
        }
        
        res.status(400).json({
            success: false,
            message: 'Données invalides',
            error: error.message
        });
    }
};



exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find({ actif: true });
        
        res.status(200).json({
            success: true,
            count: etudiants.length,  
        });
        
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};



exports.getEtudiantById = async (req, res) => {
    try {
   
        console.log('🔍 Recherche de l\'ID:', req.params.id);
        
        const etudiant = await Etudiant.findById(req.params.id);
        
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            data: etudiant
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};



exports.updateEtudiant = async (req, res) => {
    try {
        console.log('✏️ Mise à jour de l\'ID:', req.params.id);
        console.log('📥 Nouvelles données:', req.body);

        
        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params. id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Étudiant mis à jour avec succès',
            data: etudiant
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur de mise à jour',
            error: error.message
        });
    }
};


exports.deleteEtudiant = async (req, res) => {
    try {
        console.log('🗑️ Suppression de l\'ID:', req.params.id);
        
        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params.id,
            { actif: false },
            { new: true }
        );

 
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Étudiant désactivé avec succès',
            data: etudiant
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};



exports.getEtudiantsByFiliere = async (req, res) => {
    try {
        console.log('🔎 Recherche par filière:', req.params.filiere);
        

        const etudiants = await Etudiant. find({ filiere: req.params.filiere });
        
        res.status(200).json({
            success: true,
            count: etudiants.length,
            filiere: req.params.filiere,
            data: etudiants
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};

exports.searchEtudiants = async (req, res) => {
    try {
        const q = req.query.q;
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Paramètre de recherche manquant (q)'
            });
        }

        const regex = new RegExp(q, 'i'); 

        const etudiants = await Etudiant.find({
            $or: [
                { nom: regex },
                { prenom: regex }
            ]
        });

        res.status(200).json({
            success: true,
            count: etudiants.length,
            query: q,
            data: etudiants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


exports.getDisabledEtudiants = async (req, res) => {
    try {
        const etudiants = await Etudiant.find({ actif: false });

        res.status(200).json({
            success: true,
            count: etudiants.length,
            data: etudiants
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};


exports.advancedSearch = async (req, res) => {
    try {
        const { nom, filiere, anneeMin, anneeMax, moyenneMin } = req.query;
        let filter = { actif: true };

        if (nom) filter.nom = new RegExp(nom, 'i');
        if (filiere) filter.filiere = filiere;
        if (anneeMin || anneeMax) {
            filter.annee = {};
            if (anneeMin) filter.annee.$gte = parseInt(anneeMin);
            if (anneeMax) filter.annee.$lte = parseInt(anneeMax);
        }
        if (moyenneMin) filter.moyenne = { $gte: parseFloat(moyenneMin) };

        const etudiants = await Etudiant.find(filter);

        res.status(200).json({
            success: true,
            count: etudiants.length,
            filters: req.query,
            data: etudiants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};