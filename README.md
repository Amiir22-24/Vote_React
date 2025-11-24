# Application Web de Vote

Projet réalisé en équipe : une **application web de vote** avec **React + TypeScript + Vite** pour le front-end et **Laravel** pour le back-end.  

---

## Description

Cette application permet aux **utilisateurs** de voter pour leurs candidats préférés **sans authentification**, tandis que l’**admin** gère toute la plateforme :  

- Gestion des candidats et des concours (CRUD)  
- Suivi des statistiques et du nombre de votes  
- Intégration de **FedaPay** pour le système de vote  

Le projet sépare clairement le **front-end** et le **back-end**, et a été développé en équipe.

---

## Fonctionnalités

### Pour l’admin

- Authentification sécurisée  
- Gestion complète des candidats (CRUD)  
- Gestion des concours (CRUD)  
- Visualisation des statistiques et du nombre de votes  
- Gestion des transactions via FedaPay  

### Pour les utilisateurs

- Vote libre sans création de compte  
- Paiement via FedaPay pour enregistrer un vote  
- Consultation des concours et candidats  

---

## Technologies utilisées

### Front-end

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)  
- ESLint pour la qualité du code  
- Plugins React : `@vitejs/plugin-react` ou `@vitejs/plugin-react-swc`  

### Back-end

- [Laravel](https://laravel.com/)  
- PHP >= 8.x  
- Base de données : MySQL / PostgreSQL  
- API REST pour la communication front-end / back-end  
- Intégration FedaPay pour les paiements  

---

## Installation

### Back-end (Laravel)

1. Cloner le dépôt :  
   ```bash
   git clone httpshttps://github.com/Ahoefa12/Dzumevi_APi.git
   cd Dzumevi_APi
  
