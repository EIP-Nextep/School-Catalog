## Documentation de l'API Catalog

### Gestion des Écoles (`/catalog/schools`)

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/catalog/schools` | Crée une nouvelle école (l'utilisateur devient le propriétaire). |
| `GET` | `/catalog/schools` | Récupère la liste de toutes les écoles. |
| `GET` | `/catalog/schools/:id` | Détails d'une école spécifique. |
| `DELETE` | `/catalog/schools/:id` | Supprime une école (vérifie la propriété). |

### Gestion des Cours

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/catalog/schools/:schoolId/courses` | Ajoute un cours à une école spécifique. |
| `GET` | `/catalog/courses` | Liste tous les cours existants. |
| `GET` | `/catalog/schools/:schoolId/courses` | **Liste tous les cours appartenant à une école donnée.** |
| `GET` | `/catalog/courses/:id` | Détails complets d'un cours (modules + leçons). |
| `DELETE` | `/catalog/courses/:id` | Supprime un cours (vérifie la propriété de l'école). |

### Modules et Leçons

| Méthode | Route | Description |
| --- | --- | --- |
| `POST` | `/catalog/courses/:courseId/modules` | Ajoute un module à un cours. |
| `DELETE` | `/catalog/modules/:id` | Supprime un module. |
| `POST` | `/catalog/modules/:moduleId/lessons` | Ajoute une leçon à un module. |
| `DELETE` | `/catalog/lessons/:id` | Supprime une leçon. |
