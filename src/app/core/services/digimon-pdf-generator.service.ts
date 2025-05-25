// src/app/core/services/digimon-pdf-generator.service.ts
import { Injectable } from '@angular/core';
import { DigimonCharacter } from '../models/digimon-character';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class DigimonPdfGeneratorService {
  
  constructor() { }
  
  /**
   * Generate a PDF for the Digimon character sheet
   */
  generateDigimonCharacterPdf(digimon: DigimonCharacter): void {
    this.generateMultiPagePdf(digimon, 'download');
  }
  
  /**
   * Preview the Digimon character sheet as PDF
   */
  previewDigimonCharacterPdf(digimon: DigimonCharacter): void {
    this.generateMultiPagePdf(digimon, 'preview');
  }
  
  /**
   * Generate a multi-page PDF for Digimon character sheet
   */
  private async generateMultiPagePdf(digimon: DigimonCharacter, action: 'download' | 'preview'): Promise<void> {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const headerHeight = 15;
    const footerHeight = 10;
    
    // Set consistent text properties
    pdf.setFont('helvetica');
    
    let currentPage = 1;
    let yPosition = margin + headerHeight;
    
    // Add header to the first page
    this.addDigimonPageHeader(pdf, digimon, currentPage, 4);
    
    // --- PAGE 1: Digimon Information and Basic Stats ---
    
    // Digimon Information Section
    const digimonInfoSection = {
      title: "Digimon Information",
      content: this.createDigimonBasicInfoHtml(digimon),
      extraSpace: 0
    };
    
    yPosition = await this.renderSection(pdf, digimonInfoSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add space between sections
    yPosition += 25;
    
    // Base Stats Section
    const baseStatsSection = {
      title: "Base Stats",
      content: this.createBaseStatsHtml(digimon),
      extraSpace: 0
    };
    
    yPosition = await this.renderSection(pdf, baseStatsSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add page footer
    this.addDigimonPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 2: Derived Stats and DP Allocation ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addDigimonPageHeader(pdf, digimon, currentPage, 4);
    
    // Derived Stats Section
    const derivedStatsSection = {
      title: "Derived Stats",
      content: this.createDerivedStatsHtml(digimon),
      extraSpace: 0
    };
    
    yPosition = await this.renderSection(pdf, derivedStatsSection, margin, yPosition, contentWidth, pageWidth);
    
    yPosition += 25;
    
    // DP Allocation Section
    const dpSection = {
      title: "DP (Digi-Point) Allocation",
      content: this.createDPAllocationHtml(digimon),
      extraSpace: 0
    };
    
    await this.renderSection(pdf, dpSection, margin, yPosition, contentWidth, pageWidth);
    
    this.addDigimonPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 3: Qualities ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addDigimonPageHeader(pdf, digimon, currentPage, 4);
    
    const hasQualities = digimon.qualities && digimon.qualities.length > 0;
    
    if (hasQualities) {
      const qualitiesSection = {
        title: "Qualities",
        content: this.createQualitiesHtml(digimon),
        extraSpace: 5 * digimon.qualities.length
      };
      
      await this.renderSection(pdf, qualitiesSection, margin, yPosition, contentWidth, pageWidth);
    } else {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text("No Qualities selected for this Digimon.", pageWidth / 2, pageHeight / 2, { align: 'center' });
    }
    
    this.addDigimonPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 4: Attacks and Notes ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addDigimonPageHeader(pdf, digimon, currentPage, 4);
    
    // Attacks Section
    const hasAttacks = digimon.attacks && digimon.attacks.length > 0;
    
    if (hasAttacks) {
      const attacksSection = {
        title: "Attacks",
        content: this.createAttacksHtml(digimon),
        extraSpace: 10 * digimon.attacks.length
      };
      
      yPosition = await this.renderSection(pdf, attacksSection, margin, yPosition, contentWidth, pageWidth);
      yPosition += 20;
    }
    
    // Notes Section
    const notesSection = {
      title: "Notes & Evolution Tracking",
      content: this.createDigimonNotesHtml(),
      extraSpace: 0
    };
    
    await this.renderSection(pdf, notesSection, margin, yPosition, contentWidth, pageWidth);
    
    this.addDigimonPageFooter(pdf, currentPage, 4);
    
    // Output the PDF
    if (action === 'download') {
      pdf.save(`${digimon.name || digimon.species || 'Digimon'}_Sheet.pdf`);
    } else {
      pdf.output('dataurlnewwindow');
    }
  }
  
  /**
   * Helper method to render a section to the PDF
   */
  private async renderSection(
    pdf: jsPDF, 
    section: { title: string, content: string, extraSpace: number },
    margin: number,
    yPosition: number,
    contentWidth: number,
    pageWidth: number
  ): Promise<number> {
    // Add section title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.setTextColor(254, 80, 0); // Digimon orange
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;
    
    // Add section content divider line
    pdf.setDrawColor(254, 80, 0);
    pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);
    
    // Create temporary container for section content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = section.content;
    tempContainer.style.width = contentWidth + 'mm';
    tempContainer.style.padding = '0';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: contentWidth * 3.78
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      
      const newYPosition = yPosition + imgHeight + 15;
      
      document.body.removeChild(tempContainer);
      
      return newYPosition;
    } catch (error) {
      console.error('Error rendering section:', error);
      document.body.removeChild(tempContainer);
      return yPosition + 10;
    }
  }
  
  /**
   * Add a header to each page of the Digimon PDF
   */
  private addDigimonPageHeader(pdf: jsPDF, digimon: DigimonCharacter, pageNum: number, totalPages: number): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    
    // Orange background header
    pdf.setFillColor(254, 80, 0);
    pdf.rect(0, 0, pageWidth, 15, 'F');
    
    // Logo text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('DIGIMON', 10, 10);
    
    // Character name/species
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    const characterName = digimon.name || digimon.species || 'Unnamed Digimon';
    pdf.text(characterName, pageWidth / 2, margin + 2, { align: 'center' });
    
    // Page number
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, 10, { align: 'right' });
  }
  
  /**
   * Add a footer to each page of the Digimon PDF
   */
  private addDigimonPageFooter(pdf: jsPDF, pageNum: number, totalPages: number): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Footer line
    pdf.setDrawColor(254, 80, 0, 0.5);
    pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // System text
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(64, 64, 64);
    pdf.text('Digimon: Digital Adventures Character Sheet', 20, pageHeight - 10);
  }
  
  /**
   * Create the basic Digimon info section
   */
  private createDigimonBasicInfoHtml(digimon: DigimonCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <div style="display: flex; margin-bottom: 15px; align-items: center;">
          <div style="flex: 2;">
            <p style="margin: 5px 0;"><strong>Species:</strong> ${digimon.species || 'Not set'}</p>
            <p style="margin: 5px 0;"><strong>Stage:</strong> ${digimon.stage}</p>
            <p style="margin: 5px 0;"><strong>Attribute:</strong> ${digimon.attribute}</p>
            <p style="margin: 5px 0;"><strong>Field:</strong> ${digimon.field}</p>
            <p style="margin: 5px 0;"><strong>Size:</strong> ${digimon.size}</p>
          </div>
          ${digimon.profileImage ? `
            <div style="flex: 1; text-align: center;">
              <img src="${digimon.profileImage}" alt="Digimon Sprite" style="max-width: 100px; max-height: 100px; border: 2px solid #FE5000; border-radius: 8px;"/>
            </div>
          ` : ''}
        </div>
        ${digimon.description ? `<p style="margin: 10px 0;"><strong>Description:</strong> ${digimon.description}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Create the base stats section
   */
  private createBaseStatsHtml(digimon: DigimonCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #FFE5D9;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Stat</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 80px;">Current</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 60px;">+3</th>
          </tr>
          ${Object.entries(digimon.stats).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>${this.formatStatName(key)}</strong></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: #FE5000; font-weight: bold;">${value}</td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          `).join('')}
          <tr style="background-color: #FFF3E0;">
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Total</strong></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: #FE5000; font-weight: bold;">${Object.values(digimon.stats).reduce((sum, val) => sum + val, 0)}</td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
          </tr>
        </table>
      </div>
    `;
  }
  
  /**
   * Create the derived stats section
   */
  private createDerivedStatsHtml(digimon: DigimonCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #FFE5D9;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Derived Stat</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 80px;">Value</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 80px;">Notes</th>
          </tr>
          ${Object.entries(digimon.derivedStats).map(([key, value]) => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>${this.formatStatName(key)}</strong></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: #FE5000; font-weight: bold;">${value}</td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create the DP allocation section
   */
  private createDPAllocationHtml(digimon: DigimonCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #FFE5D9;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">DP Category</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 80px;">Spent</th>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Stats DP</strong></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: #FE5000; font-weight: bold;">${digimon.spentStatsDP}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Qualities DP</strong></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: #FE5000; font-weight: bold;">${digimon.spentQualitiesDP}</td>
          </tr>
          <tr style="background-color: ${digimon.remainingDP < 0 ? '#FFEBEE' : '#E8F5E8'};">
            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Remaining DP</strong></td>
            <td style="padding: 8px; text-align: center; border: 1px solid #ddd; color: ${digimon.remainingDP < 0 ? '#D32F2F' : '#2E7D32'}; font-weight: bold;">${digimon.remainingDP}</td>
          </tr>
        </table>
      </div>
    `;
  }
  
  /**
   * Create the qualities section
   */
  private createQualitiesHtml(digimon: DigimonCharacter): string {
    if (!digimon.qualities || digimon.qualities.length === 0) {
      return '<p style="text-align: center; font-style: italic; color: #666;">No qualities selected.</p>';
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #FFE5D9;">
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quality</th>
            <th style="padding: 8px; text-align: center; border: 1px solid #ddd; width: 60px;">Rank</th>
            <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Applied To</th>
          </tr>
          ${digimon.qualities.map(quality => `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; color: #FE5000;"><strong>${quality.qualityId}</strong></td>
              <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${quality.rank}</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${quality.appliedToAttack || 'General'}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create the attacks section
   */
  private createAttacksHtml(digimon: DigimonCharacter): string {
    if (!digimon.attacks || digimon.attacks.length === 0) {
      return '<p style="text-align: center; font-style: italic; color: #666;">No attacks configured.</p>';
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        ${digimon.attacks.map(attack => `
          <div style="margin-bottom: 15px; border: 1px solid #FE5000; border-radius: 8px; padding: 10px;">
            <h4 style="margin: 0 0 5px 0; color: #FE5000;">${attack.name}</h4>
            <p style="margin: 5px 0; font-size: 14px;">${attack.description}</p>
            <div style="margin: 5px 0;">
              <strong>Tags:</strong> 
              ${attack.tags.map(tag => `<span style="background-color: #FFE5D9; padding: 2px 6px; margin: 0 2px; border-radius: 4px; font-size: 12px;">${tag}</span>`).join('')}
            </div>
            ${attack.effects && attack.effects.length > 0 ? `
              <div style="margin: 5px 0;">
                <strong>Effects:</strong> ${attack.effects.join(', ')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>
    `;
  }
  
  /**
   * Create a notes section for evolution tracking and general notes
   */
  private createDigimonNotesHtml(): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <div style="margin-bottom: 20px;">
          <h4 style="color: #FE5000; margin-bottom: 5px;">Evolution Progress</h4>
          <div style="border: 1px solid #ddd; height: 80px; width: 100%; margin-bottom: 15px;"></div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: #FE5000; margin-bottom: 5px;">Battle Notes</h4>
          <div style="border: 1px solid #ddd; height: 80px; width: 100%; margin-bottom: 15px;"></div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h4 style="color: #FE5000; margin-bottom: 5px;">DP Spending Log</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #FFE5D9;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 60%;">Upgrade/Purchase</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 20%;">DP Cost</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 20%;">Date</th>
            </tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td><td style="padding: 8px; border: 1px solid #ddd;"></td></tr>
          </table>
        </div>
      </div>
    `;
  }
  
  /**
   * Format a stat name to be more readable
   */
  private formatStatName(name: string): string {
    // Handle camelCase to proper case
    const formatted = name.replace(/([A-Z])/g, ' $1').trim();
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}