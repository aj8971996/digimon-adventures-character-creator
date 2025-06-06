// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Home/Landing page
  {
    path: '',
    loadComponent: () => import('./features/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  
  // Human Character Creator feature
  {
    path: 'human-character',
    loadComponent: () => import('./features/human-character/human-character.component').then(m => m.HumanCharacterComponent),
    children: [
      { 
        path: '', 
        redirectTo: 'campaign-selection', 
        pathMatch: 'full' 
      },
      {
        path: 'campaign-selection',
        loadComponent: () => import('./features/human-character/campaign-selection/campaign-selection.component').then(m => m.CampaignSelectionComponent)
      },
      {
        path: 'character-basics',
        loadComponent: () => import('./features/human-character/character-basics/character-basics.component').then(m => m.CharacterBasicsComponent)
      },
      {
        path: 'attributes-allocation',
        loadComponent: () => import('./features/human-character/attributes-allocation/attributes-allocation.component').then(m => m.AttributesAllocationComponent)
      },
      {
        path: 'skills-allocation',
        loadComponent: () => import('./features/human-character/skills-allocation/skills-allocation.component').then(m => m.SkillsAllocationComponent)
      },
      {
        path: 'special-orders',
        loadComponent: () => import('./features/human-character/special-orders/special-orders.component').then(m => m.SpecialOrdersComponent)
      },
      {
        path: 'aspects',
        loadComponent: () => import('./features/human-character/aspects/aspects.component').then(m => m.AspectsComponent)
      },
      {
        path: 'torments',
        loadComponent: () => import('./features/human-character/torments/torments.component').then(m => m.TormentsComponent)
      },
      {
        path: 'derived-stats',
        loadComponent: () => import('./features/human-character/derived-stats/derived-stats.component').then(m => m.DerivedStatsComponent)
      },
      {
        path: 'character-summary',
        loadComponent: () => import('./features/human-character/character-summary/character-summary.component').then(m => m.CharacterSummaryComponent)
      }
    ]
  },
  
  // Digimon Character Creator feature
  {
    path: 'digimon-character',
    loadComponent: () => import('./features/digimon-character/digimon-character.component').then(m => m.DigimonCharacterComponent),
    children: [
      { 
        path: '', 
        redirectTo: 'basic-info', 
        pathMatch: 'full' 
      },
      {
        path: 'basic-info',
        loadComponent: () => import('./features/digimon-character/digimon-basic-info/digimon-basic-info.component').then(m => m.DigimonBasicInfoComponent)
      },
      {
        path: 'stats-allocation',
        loadComponent: () => import('./features/digimon-character/digimon-stats-allocation/digimon-stats-allocation.component').then(m => m.DigimonStatsAllocationComponent)
      },
      {
        path: 'qualities-selection',
        loadComponent: () => import('./features/digimon-character/digimon-qualities-selection/digimon-qualities-selection.component').then(m => m.DigimonQualitiesSelectionComponent)
      },
      {
        path: 'attacks-configuration',
        loadComponent: () => import('./features/digimon-character/digimon-attacks/digimon-attacks.component').then(m => m.DigimonAttacksConfigurationComponent)
      },
      {
        path: 'evolution-line-selection',
        loadComponent: () => import('./features/digimon-character/evolution-line-selection/evolution-line-selection.component').then(m => m.EvolutionLineSelectionComponent)
      },
      {
        path: 'character-summary',
        loadComponent: () => import('./features/digimon-character/digimon-character-summary/digimon-character-summary.component').then(m => m.DigimonCharacterSummaryComponent)
      }
    ]
  },
  
  // Fallback for any unmatched routes
  {
    path: '**',
    redirectTo: ''
  }
];