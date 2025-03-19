Voici un **README.md** complet et bien structuré pour votre bot d'anniversaire Discord. 🚀

---

# 🎂 Bot d'anniversaire Discord

**N'oubliez plus jamais l'anniversaire de vos amis sur Discord !**  
Ce bot permet d'enregistrer et d'afficher automatiquement les anniversaires des membres sur un serveur Discord.

---

## 🚀 **Fonctionnalités**

✅ **Enregistrer son propre anniversaire**  
✅ **Ajouter l’anniversaire d’un autre utilisateur**  
✅ **Consulter les anniversaires du jour**  
✅ **Voir la liste des prochains anniversaires**  
✅ **Définir un canal spécifique pour les annonces d’anniversaires**  
✅ **Envoyer un message automatique chaque jour à 9h avec les anniversaires**  
✅ **Gérer les serveurs où le bot est présent (réservé au propriétaire)**

---

## 📌 **Installation**

### **1️⃣ Prérequis**

-   **Node.js 16+** doit être installé : [Télécharger Node.js](https://nodejs.org/)
-   **Créer un bot sur Discord** via le [Discord Developer Portal](https://discord.com/developers/applications)
-   **Récupérer le token du bot** et l’ajouter à un fichier `.env`

### **2️⃣ Installation des dépendances**

Clonez le projet et installez les modules nécessaires :

```sh
git clone git@github.com:Kara-ipssi/annivebot.git
cd annivebot
npm install
cp .exmeple.env .env
```

### **3️⃣ Configurer le bot**

Créez un fichier **`.env`** à la racine du projet et ajoutez :

```
TOKEN=VOTRE_TOKEN_DISCORD
```

---

## 🏃‍♂️ **Lancer le bot**

Exécutez la commande suivante pour démarrer le bot :

```sh
npm run dev
```

---

## 📜 **Commandes disponibles**

| Commande                               | Description                                                  |
| -------------------------------------- | ------------------------------------------------------------ |
| `!annive ajouter <JJ/MM>`              | Enregistre votre anniversaire                                |
| `!annive ajouter @utilisateur <JJ/MM>` | Enregistre l’anniversaire d’un autre utilisateur             |
| `!annive aujourd’hui`                  | Affiche les anniversaires du jour                            |
| `!annive prochains`                    | Liste les prochains anniversaires                            |
| `!annive setchannel`                   | Définit le canal actuel pour les annonces                    |
| `!annive setchannel #channel`          | Définit un canal spécifique pour les annonces                |
| `!annive servers`                      | 🔒 **(Owner only)** Liste les serveurs où le bot est présent |

---

## ⚙️ **Configuration avancée**

### **Modifier l'heure d'envoi automatique des anniversaires**

Par défaut, le bot envoie un message chaque jour à **9h00** avec la liste des anniversaires.  
Vous pouvez modifier cette heure dans `index.js` :

```javascript
const CHECK_HOUR = 9; // Modifier cette valeur pour changer l’heure
```

### **Changer le préfixe des commandes**

Le bot utilise **`!annive`** comme préfixe, mais vous pouvez le modifier dans `index.js` :

```javascript
const PREFIX = "!annive"; // Modifier ici
```

---

## 🔧 **Problèmes fréquents**

### **1. "Missing Permissions"**

Assurez-vous que le bot a les permissions **Envoyer des messages** et **Gérer les messages** sur le serveur.

### **2. "Error: SQLITE_ERROR"**

Si vous rencontrez une erreur SQLite, essayez de supprimer le fichier `birthdays.db` et relancez le bot.

---

## 👑 **Accès réservé au propriétaire**

Seul le **propriétaire du bot** (vous) peut exécuter `!annive servers` pour voir la liste des serveurs où le bot est installé.  
Modifiez cette ligne avec votre **ID Discord** :

```javascript
const ownerId = "VOTRE_USER_ID"; // Remplacez par votre ID
```

---

## 📬 **Suggestions et améliorations**

Ce bot peut encore être amélioré !  
Si vous avez des idées, ouvrez une **issue** ou proposez une **pull request** sur GitHub. 😃

---

🚀 **Bon anniversaire et amusez-vous bien avec votre bot !** 🎉🥳
