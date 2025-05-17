import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../../../core/services/character.service';
import { HumanCharacterWizardService } from '../human-character-wizard.service';
import { DerivedStats } from '../../../core/models/derived-stats';

@Component({
  selector: 'app-derived-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './derived-stats.component.html',
  styleUrl: './derived-stats.component.scss'
})
export class DerivedStatsComponent implements OnInit {
  derivedStats: DerivedStats = {
    woundBox: 0,
    speed: 0,
    accuracyPool: 0,
    dodgePool: 0,
    armor: 0,
    damage: 0
  };
  
  attributeDescriptions: { [key: string]: string } = {
    woundBox: 'How much damage your character can take before being seriously injured.',
    speed: 'How fast your character can move in combat.',
    accuracyPool: 'Your character\'s ability to hit targets in combat.',
    dodgePool: 'Your character\'s ability to avoid being hit in combat.',
    armor: 'How well your character can withstand damage.',
    damage: 'How much damage your character can deal in combat.'
  };
  
  formulas: { [key: string]: string } = {
    woundBox: 'Max(2, Body + Endurance)',
    speed: 'Agility + Survival',
    accuracyPool: 'Agility + Fight',
    dodgePool: 'Agility + Dodge',
    armor: 'Body + Endurance',
    damage: 'Body + Fight'
  };
  
  constructor(
    private characterService: CharacterService,
    private wizardService: HumanCharacterWizardService
  ) {}

  ngOnInit(): void {
    const character = this.characterService.getCurrentCharacter();
    this.derivedStats = character.derivedStats;
  }
  
  goBack(): void {
    this.wizardService.previousStep();
  }
  
  proceed(): void {
    this.wizardService.nextStep();
  }
}