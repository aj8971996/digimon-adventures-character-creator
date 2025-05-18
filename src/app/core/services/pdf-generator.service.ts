import { Injectable } from '@angular/core';
import { HumanCharacter } from '../models/human-character';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  
  constructor() { }
  
  /**
   * Generate a PDF for the human character sheet
   */
  generateHumanCharacterPdf(character: HumanCharacter): void {
    this.generateMultiPagePdf(character, 'download');
  }
  
  /**
   * Open the PDF in a new window/tab for preview
   */
  previewHumanCharacterPdf(character: HumanCharacter): void {
    this.generateMultiPagePdf(character, 'preview');
  }
  
  /**
   * Generate a multi-page PDF using jsPDF directly
   * Made async to properly handle sequential rendering of sections
   * Improved layout organization with controlled page breaks
   */
  private async generateMultiPagePdf(character: HumanCharacter, action: 'download' | 'preview'): Promise<void> {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // margin in mm
    const contentWidth = pageWidth - (margin * 2);
    const headerHeight = 15; // Height allocated for header
    const footerHeight = 10; // Height allocated for footer
    const contentHeight = pageHeight - margin - headerHeight - footerHeight - margin;
    
    // Set consistent text properties
    pdf.setFont('helvetica');
    
    // Organize content into specific pages for better layout
    // Page 1: Character Info and Derived Stats
    // Page 2: Agility, Body, Charisma attributes and skills
    // Page 3: Intelligence and other attributes, Special Orders
    // Page 4: Aspects and Torments together
    // Last Page: Notes (full page)
    
    // Create the first page with Character Info and Derived Stats
    let currentPage = 1;
    let yPosition = margin + headerHeight;
    
    // Add character name header to the first page
    this.addPageHeader(pdf, character, currentPage, 4); // Update total page count
    
    // --- PAGE 1: Character Information and Derived Stats ---
    
    // Character Information Section
    const characterInfoSection = {
      title: "Character Information",
      content: this.createBasicInfoHtml(character),
      extraSpace: 0
    };
    
    yPosition = await this.renderSection(pdf, characterInfoSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add extra space between Character Info and Derived Stats to prevent collision
    yPosition += 25; // Increased from 15 to 25 to provide more separation
    
    // Derived Stats Section
    const derivedStatsSection = {
      title: "Derived Stats",
      content: this.createDerivedStatsHtml(character),
      extraSpace: 0
    };
    
    await this.renderSection(pdf, derivedStatsSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add page footer
    this.addPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 2: Agility, Body, Charisma attributes ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addPageHeader(pdf, character, currentPage, 4);
    
    // Filter attributes for page 2 (Agility, Body, Charisma)
    const page2Attributes = character.attributes.filter(attr => 
      ['agility', 'body', 'charisma'].includes(attr.id.toLowerCase())
    );
    
    const page2AttributesSection = {
      title: "Attributes & Skills",
      content: this.createFilteredAttributesHtml(page2Attributes),
      extraSpace: 5 * page2Attributes.length
    };
    
    await this.renderSection(pdf, page2AttributesSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add page footer
    this.addPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 3: Intelligence and other attributes, Special Orders ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addPageHeader(pdf, character, currentPage, 4);
    
    // Filter remaining attributes (Intelligence and any others)
    const page3Attributes = character.attributes.filter(attr => 
      !['agility', 'body', 'charisma'].includes(attr.id.toLowerCase())
    );
    
    if (page3Attributes.length > 0) {
      const page3AttributesSection = {
        title: "Additional Attributes & Skills",
        content: this.createFilteredAttributesHtml(page3Attributes),
        extraSpace: 5 * page3Attributes.length
      };
      
      await this.renderSection(pdf, page3AttributesSection, margin, yPosition, contentWidth, pageWidth);
      yPosition += this.estimateSectionHeight(page3AttributesSection) + page3AttributesSection.extraSpace + 15;
    }
    
    // Special Orders if they exist
    if (character.specialOrders && character.specialOrders.length > 0) {
      const specialOrdersSection = {
        title: "Special Orders",
        content: this.createSpecialOrdersHtml(character),
        extraSpace: 5 * character.specialOrders.length
      };
      
      await this.renderSection(pdf, specialOrdersSection, margin, yPosition, contentWidth, pageWidth);
    }
    
    // Add page footer
    this.addPageFooter(pdf, currentPage, 4);
    
    // --- PAGE 4: Aspects and Torments together (centered on page) ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addPageHeader(pdf, character, currentPage, 4);
    
    // Calculate content to center vertically
    let aspectsHeight = 0;
    let tormentsHeight = 0;
    let totalContentHeight = 0;
    
    const hasAspects = character.aspects && character.aspects.length > 0;
    const hasTorments = character.torments && character.torments.length > 0;
    
    // Calculate expected heights for aspects and torments
    if (hasAspects) {
      const aspectsSection = {
        title: "Aspects",
        content: this.createAspectsHtml(character),
        extraSpace: 5 * character.aspects.length
      };
      aspectsHeight = this.estimateSectionHeight(aspectsSection) + aspectsSection.extraSpace + 15;
      totalContentHeight += aspectsHeight;
    }
    
    if (hasTorments) {
      const tormentsSection = {
        title: "Torments",
        content: this.createTormentsHtml(character),
        extraSpace: 10 * character.torments.length
      };
      tormentsHeight = this.estimateSectionHeight(tormentsSection) + tormentsSection.extraSpace;
      totalContentHeight += tormentsHeight;
    }
    
    // Calculate starting position to center content vertically
    const availableHeight = pageHeight - (margin + headerHeight) - margin - footerHeight;
    const emptySpace = Math.max(0, availableHeight - totalContentHeight);
    const topPadding = emptySpace / 2; // Divide empty space for top and bottom margins
    
    // Start rendering at calculated position to center content
    yPosition += topPadding;
    
    // Aspects if they exist
    if (hasAspects) {
      const aspectsSection = {
        title: "Aspects",
        content: this.createAspectsHtml(character),
        extraSpace: 5 * character.aspects.length
      };
      
      yPosition = await this.renderSection(pdf, aspectsSection, margin, yPosition, contentWidth, pageWidth);
      
      // Add spacing between aspects and torments
      if (hasTorments) {
        yPosition += 20; // Extra space between sections
      }
    }
    
    // Torments if they exist
    if (hasTorments) {
      const tormentsSection = {
        title: "Torments",
        content: this.createTormentsHtml(character),
        extraSpace: 10 * character.torments.length
      };
      
      await this.renderSection(pdf, tormentsSection, margin, yPosition, contentWidth, pageWidth);
    }
    
    // Add page footer
    this.addPageFooter(pdf, currentPage, 4);
    
    // --- LAST PAGE: Full page Notes section ---
    pdf.addPage();
    currentPage++;
    yPosition = margin + headerHeight;
    this.addPageHeader(pdf, character, currentPage, 4);
    
    // Make Notes section much larger to fill the page
    const notesSection = {
      title: "Notes",
      content: this.createLargeNotesHtml(),
      extraSpace: 0
    };
    
    await this.renderSection(pdf, notesSection, margin, yPosition, contentWidth, pageWidth);
    
    // Add page footer
    this.addPageFooter(pdf, currentPage, 4);
    
    // Output the PDF once ALL sections have been processed
    if (action === 'download') {
      pdf.save(`${character.name || 'Character'}_Sheet.pdf`);
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
    pdf.setTextColor(0, 83, 160); // #0053A0 Digivice blue
    pdf.text(section.title, margin, yPosition);
    yPosition += 8;
    
    // Add section content divider line
    pdf.setDrawColor(0, 83, 160); // #0053A0 Digivice blue
    pdf.line(margin, yPosition - 3, pageWidth - margin, yPosition - 3);
    
    // Create temporary container for section content
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = section.content;
    tempContainer.style.width = contentWidth + 'mm';
    tempContainer.style.padding = '0';
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    document.body.appendChild(tempContainer);
    
    // IMPORTANT: Wait for canvas to render before continuing
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: contentWidth * 3.78 // Convert mm to px (1mm ≈ 3.78px)
      });
      
      // Calculate image dimensions and position
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add the image to the PDF
      pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      
      // Update Y position for next section
      const newYPosition = yPosition + imgHeight + 15;
      
      // Cleanup temporary container
      document.body.removeChild(tempContainer);
      
      return newYPosition;
    } catch (error) {
      console.error('Error rendering section:', error);
      document.body.removeChild(tempContainer);
      return yPosition + 10; // Return a slightly incremented position as fallback
    }
  }
  
  /**
   * Add a header to each page of the PDF
   */
  private addPageHeader(pdf: jsPDF, character: HumanCharacter, pageNum: number, totalPages: number): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    
    // Logo style header similar to the app header
    pdf.setFillColor(17, 27, 41); // Background color
    pdf.rect(0, 0, pageWidth, 15, 'F');
    
    // Logo text
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(0, 83, 160); // #0053A0 Digivice blue
    pdf.text('D:DA', 10, 10);
    
    // Highlight part of logo
    pdf.setTextColor(255, 216, 0); // #FFD800 Digivice yellow
    pdf.text('[C]', 22, 10);
    
    // Character name
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(0, 83, 160); // #0053A0 Digivice blue
    const characterName = character.name || 'Unnamed Character';
    pdf.text(characterName, pageWidth / 2, margin + 2, { align: 'center' });
    
    // Page number
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(160, 160, 160); // Gray
    pdf.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, 10, { align: 'right' });
  }
  
  /**
   * Add a footer to each page of the PDF
   */
  private addPageFooter(pdf: jsPDF, pageNum: number, totalPages: number): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Footer line
    pdf.setDrawColor(0, 83, 160, 0.5); // #0053A0 with transparency
    pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // System text
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8);
    pdf.setTextColor(64, 64, 64); // Dark gray
    pdf.text('Digimon: Digital Adventures Character Sheet', 20, pageHeight - 10);
  }
  
  /**
   * Estimate the height of a section for pagination purposes
   * Improved to be more accurate and conservative
   */
  private estimateSectionHeight(section: { title: string, content: string, extraSpace: number }): number {
    // Basic height for title and padding
    let height = 20; 
    
    // Better estimate content height based on content complexity
    const contentLength = section.content.length;
    const tableCount = (section.content.match(/<table/g) || []).length;
    const rowCount = (section.content.match(/<tr/g) || []).length;
    
    // Estimate based on text content (more conservative)
    height += contentLength / 50; // More conservative ratio
    
    // Add height for tables (increase from 15 to 25)
    height += tableCount * 25;
    
    // Add height for rows (increase from 8 to 12)
    height += rowCount * 12;
    
    // Add a small buffer to prevent crowding
    height += 10;
    
    return height;
  }
  
  /**
   * Create the basic info section
   */
  private createBasicInfoHtml(character: HumanCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <div style="display: flex; margin-bottom: 10px;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Age:</strong> ${character.age || 'Not set'}</p>
            <p style="margin: 5px 0;"><strong>Campaign Type:</strong> ${character.campaignType}</p>
          </div>
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Character ID:</strong> ${character.id}</p>
          </div>
        </div>
        ${character.description ? `<p style="margin: 5px 0;"><strong>Description:</strong> ${character.description}</p>` : ''}
        ${character.backstory ? `<p style="margin: 5px 0;"><strong>Backstory:</strong> ${character.backstory}</p>` : ''}
      </div>
    `;
  }
  
  /**
   * Create the attributes and skills section
   */
  private createAttributesHtml(character: HumanCharacter): string {
    let html = `<div style="font-family: Arial, sans-serif; color: #333; width: 100%;">`;
    
    for (const attribute of character.attributes) {
      html += `
        <div style="margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr style="background-color: #A8D8E8;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd;">${attribute.name}</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">Current</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+3</th>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;"><strong>Attribute Value</strong></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #0053A0;"><strong>${attribute.value}</strong></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          </table>
      `;
      
      if (attribute.skills && attribute.skills.length > 0) {
        html += `
          <table style="width: 100%; border-collapse: collapse; margin-left: 10px; margin-bottom: 15px;">
            <tr style="background-color: #A8D8E8;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Skill Name</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">Current</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+3</th>
            </tr>
        `;
        
        for (const skill of attribute.skills) {
          html += `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;">${skill.name}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #0053A0;">${skill.value}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          `;
        }
        
        html += `</table>`;
      }
      
      html += `</div>`;
    }
    
    html += `</div>`;
    return html;
  }
  
  /**
   * Create the derived stats section
   */
  private createDerivedStatsHtml(character: HumanCharacter): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #A8D8E8;">
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Derived Stat</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">Current</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
          </tr>
          ${Object.entries(character.derivedStats).map(([key, value]) => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;">${this.formatStatName(key)}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #0053A0;">${value}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create the special orders section
   */
  private createSpecialOrdersHtml(character: HumanCharacter): string {
    if (!character.specialOrders || character.specialOrders.length === 0) {
      return '';
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #A8D8E8;">
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 25%;">Special Order</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 15%;">Type</th>
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 60%;">Description</th>
          </tr>
          ${character.specialOrders.map(order => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd; color: #0053A0;"><strong>${order.name}</strong></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #FE5000;">${order.orderType}</td>
              <td style="padding: 6px; border: 1px solid #ddd;">${order.description || ''}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create the aspects section
   */
  private createAspectsHtml(character: HumanCharacter): string {
    if (!character.aspects || character.aspects.length === 0) {
      return '';
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #A8D8E8;">
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 30%;">Aspect</th>
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 70%;">Description</th>
          </tr>
          ${character.aspects.map(aspect => `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd; color: #0053A0;"><strong>${aspect.name}</strong></td>
              <td style="padding: 6px; border: 1px solid #ddd;">${aspect.description || ''}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create the torments section
   */
  private createTormentsHtml(character: HumanCharacter): string {
    if (!character.torments || character.torments.length === 0) {
      return '';
    }
    
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background-color: #A8D8E8;">
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 20%;">Torment</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 10%;">Type</th>
            <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 20%;">Progress</th>
            <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 50%;">Description</th>
          </tr>
          ${character.torments.map(torment => {
            const maxProgress = torment.type === 'Minor' ? 2 : torment.type === 'Major' ? 3 : 4;
            let progressText = '';
            for (let i = 0; i < maxProgress; i++) {
              progressText += i < torment.progress ? '■ ' : '□ ';
            }
            
            return `
              <tr>
                <td style="padding: 6px; border: 1px solid #ddd; color: #0053A0;"><strong>${torment.name}</strong></td>
                <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #FE5000;">${torment.type}</td>
                <td style="padding: 6px; text-align: center; border: 1px solid #ddd; font-family: monospace; font-size: 16px; letter-spacing: 2px;">${progressText}</td>
                <td style="padding: 6px; border: 1px solid #ddd;">${torment.description || ''}</td>
              </tr>
            `;
          }).join('')}
        </table>
      </div>
    `;
  }
  
  /**
   * Create filtered attributes HTML for specific attributes
   */
  private createFilteredAttributesHtml(attributes: any[]): string {
    let html = `<div style="font-family: Arial, sans-serif; color: #333; width: 100%;">`;
    
    for (const attribute of attributes) {
      html += `
        <div style="margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr style="background-color: #A8D8E8;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd;">${attribute.name}</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">Current</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+3</th>
            </tr>
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;"><strong>Attribute Value</strong></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #0053A0;"><strong>${attribute.value}</strong></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          </table>
      `;
      
      if (attribute.skills && attribute.skills.length > 0) {
        html += `
          <table style="width: 100%; border-collapse: collapse; margin-left: 10px; margin-bottom: 15px;">
            <tr style="background-color: #A8D8E8;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd;">Skill Name</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">Current</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+1</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+2</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 60px;">+3</th>
            </tr>
        `;
        
        for (const skill of attribute.skills) {
          html += `
            <tr>
              <td style="padding: 6px; border: 1px solid #ddd;">${skill.name}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd; color: #0053A0;">${skill.value}</td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
              <td style="padding: 6px; text-align: center; border: 1px solid #ddd;"></td>
            </tr>
          `;
        }
        
        html += `</table>`;
      }
      
      html += `</div>`;
    }
    
    html += `</div>`;
    return html;
  }

  /**
   * Create a larger notes section for updates, additional information, etc.
   */
  private createLargeNotesHtml(): string {
    return `
      <div style="font-family: Arial, sans-serif; color: #333; width: 100%;">
        <p style="margin-bottom: 10px; font-style: italic; color: #666;">Use this space for additional notes, character development, or campaign events:</p>
        
        <!-- Section for general notes -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #0053A0; margin-bottom: 5px;">General Notes</h4>
          <div style="border: 1px solid #ddd; height: 120px; width: 100%; margin-bottom: 15px;"></div>
        </div>
        
        <!-- Section for campaign events -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #0053A0; margin-bottom: 5px;">Campaign Events</h4>
          <div style="border: 1px solid #ddd; height: 120px; width: 100%; margin-bottom: 15px;"></div>
        </div>
        
        <!-- Section for character development -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #0053A0; margin-bottom: 5px;">Character Development</h4>
          <div style="border: 1px solid #ddd; height: 120px; width: 100%; margin-bottom: 15px;"></div>
        </div>
        
        <!-- Section for experience points tracking -->
        <div style="margin-bottom: 20px;">
          <h4 style="color: #0053A0; margin-bottom: 5px;">Experience Points</h4>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #A8D8E8;">
              <th style="padding: 6px; text-align: left; border: 1px solid #ddd; width: 60%;">Session/Event</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 20%;">Date</th>
              <th style="padding: 6px; text-align: center; border: 1px solid #ddd; width: 20%;">XP Gained</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
              <td style="padding: 8px; border: 1px solid #ddd;"></td>
            </tr>
          </table>
        </div>
      </div>
    `;
  }
  
  /**
   * Format a stat name to be more readable
   */
  private formatStatName(name: string): string {
    const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
    return formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
  }
}