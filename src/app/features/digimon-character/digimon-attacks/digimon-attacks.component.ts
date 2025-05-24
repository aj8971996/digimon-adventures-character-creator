// src/app/features/digimon-character/digimon-attacks-configuration/digimon-attacks-configuration.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigimonService } from '../../../core/services/digimon.service';
import { DigimonCharacterWizardService } from '../digimon-character-wizard.service';
import { DigimonCharacter } from '../../../core/models/digimon-character';
import { DigimonAttack, AttackTag } from '../../../core/models/digimon-attack';

@Component({
  selector: 'app-digimon-attacks-configuration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digimon-attacks-configuration.component.html',
  styleUrl: './digimon-attacks-configuration.component.scss'
})
export class DigimonAttacksConfigurationComponent implements OnInit {
  digimon: DigimonCharacter | null = null;
  availableAttackTags = Object.values(AttackTag);
  
  newAttack: DigimonAttack = {
    id: '',
    name: '',
    description: '',
    tags: [AttackTag.Melee, AttackTag.Damage],
    effects: []
  };
  
  editIndex: number | null = null;

  constructor(
    private digimonService: DigimonService,
    private wizardService: DigimonCharacterWizardService
  ) {}

  ngOnInit(): void {
    this.digimon = this.digimonService.getCurrentDigimon();
  }

  getMaxAttacks(): number {
    if (!this.digimon) return 0;
    const stageConfig = this.digimonService.getStageConfig(this.digimon.stage);
    return stageConfig?.attacks || 2;
  }

  canAddAttack(): boolean {
    if (!this.digimon) return false;
    return this.digimon.attacks.length < this.getMaxAttacks();
  }

  isAttackFormValid(): boolean {
    return !!(this.newAttack.name?.trim() && 
              this.newAttack.description?.trim() && 
              this.newAttack.tags.length >= 2 &&
              this.hasRequiredTags());
  }

  hasRequiredTags(): boolean {
    const hasMeleeOrRanged = this.newAttack.tags.includes(AttackTag.Melee) || 
                            this.newAttack.tags.includes(AttackTag.Ranged);
    const hasDamageOrSupport = this.newAttack.tags.includes(AttackTag.Damage) || 
                              this.newAttack.tags.includes(AttackTag.Support);
    return hasMeleeOrRanged && hasDamageOrSupport;
  }

  toggleAttackTag(tag: AttackTag): void {
    const index = this.newAttack.tags.indexOf(tag);
    
    if (index > -1) {
      // Don't allow removing if it would break required tag rules
      if ((tag === AttackTag.Melee || tag === AttackTag.Ranged) && 
          !this.newAttack.tags.some(t => t !== tag && (t === AttackTag.Melee || t === AttackTag.Ranged))) {
        return; // Must have at least one melee or ranged
      }
      if ((tag === AttackTag.Damage || tag === AttackTag.Support) && 
          !this.newAttack.tags.some(t => t !== tag && (t === AttackTag.Damage || t === AttackTag.Support))) {
        return; // Must have at least one damage or support
      }
      
      this.newAttack.tags.splice(index, 1);
    } else {
      // Handle mutual exclusivity
      if (tag === AttackTag.Melee && this.newAttack.tags.includes(AttackTag.Ranged)) {
        this.newAttack.tags = this.newAttack.tags.filter(t => t !== AttackTag.Ranged);
      }
      if (tag === AttackTag.Ranged && this.newAttack.tags.includes(AttackTag.Melee)) {
        this.newAttack.tags = this.newAttack.tags.filter(t => t !== AttackTag.Melee);
      }
      if (tag === AttackTag.Damage && this.newAttack.tags.includes(AttackTag.Support)) {
        this.newAttack.tags = this.newAttack.tags.filter(t => t !== AttackTag.Support);
      }
      if (tag === AttackTag.Support && this.newAttack.tags.includes(AttackTag.Damage)) {
        this.newAttack.tags = this.newAttack.tags.filter(t => t !== AttackTag.Damage);
      }
      
      this.newAttack.tags.push(tag);
    }
  }

  hasAttackTag(tag: AttackTag): boolean {
    return this.newAttack.tags.includes(tag);
  }

  addAttack(): void {
    if (!this.digimon || !this.canAddAttack() || !this.isAttackFormValid()) return;
    
    const attack: DigimonAttack = {
      id: this.generateId(),
      name: this.newAttack.name.trim(),
      description: this.newAttack.description.trim(),
      tags: [...this.newAttack.tags],
      effects: [...(this.newAttack.effects || [])]
    };
    
    this.digimon.attacks.push(attack);
    this.updateDigimon();
    this.resetForm();
  }

  startEdit(index: number): void {
    this.editIndex = index;
    const attack = this.digimon!.attacks[index];
    this.newAttack = {
      id: attack.id,
      name: attack.name,
      description: attack.description,
      tags: [...attack.tags],
      effects: [...(attack.effects || [])]
    };
  }

  cancelEdit(): void {
    this.editIndex = null;
    this.resetForm();
  }

  saveEdit(): void {
    if (this.editIndex === null || !this.digimon || !this.isAttackFormValid()) return;
    
    this.digimon.attacks[this.editIndex] = {
      id: this.newAttack.id || this.generateId(),
      name: this.newAttack.name.trim(),
      description: this.newAttack.description.trim(),
      tags: [...this.newAttack.tags],
      effects: [...(this.newAttack.effects || [])]
    };
    
    this.updateDigimon();
    this.editIndex = null;
    this.resetForm();
  }

  deleteAttack(index: number): void {
    if (!this.digimon) return;
    
    this.digimon.attacks.splice(index, 1);
    this.updateDigimon();
    
    if (this.editIndex === index) {
      this.editIndex = null;
      this.resetForm();
    }
  }

  resetForm(): void {
    this.newAttack = {
      id: '',
      name: '',
      description: '',
      tags: [AttackTag.Melee, AttackTag.Damage],
      effects: []
    };
  }

  updateDigimon(): void {
    if (this.digimon) {
      this.digimonService.updateDigimon({
        attacks: [...this.digimon.attacks]
      });
      this.digimon = this.digimonService.getCurrentDigimon();
    }
  }

  generateId(): string {
    return 'attack_' + Math.random().toString(36).substring(2, 9);
  }

  getAttackTagDescription(tag: AttackTag): string {
    const descriptions: { [key in AttackTag]: string } = {
      [AttackTag.Melee]: 'Close-range attack that requires adjacency',
      [AttackTag.Ranged]: 'Long-range attack that can hit distant targets',
      [AttackTag.Damage]: 'Deals damage to targets',
      [AttackTag.Support]: 'Provides beneficial effects without dealing damage',
      [AttackTag.Area]: 'Affects multiple targets in an area',
      [AttackTag.Charge]: 'Allows movement and attack in one action',
      [AttackTag.Weapon]: 'Enhanced by weapon-related qualities',
      [AttackTag.SignatureMove]: 'Powerful special attack with cooldown'
    };
    return descriptions[tag] || '';
  }

  goBack(): void {
    this.wizardService.previousStep();
  }

  proceed(): void {
    this.wizardService.nextStep();
  }
}