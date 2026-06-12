import { describe, it, expect } from 'vitest';
import { formatSource } from './taxonomy';

describe('Taxonomy Mapping', () => {
  it('should map exact matches correctly', () => {
    expect(formatSource('instagram')).toBe('Instagram');
    expect(formatSource('ig')).toBe('Instagram');
    expect(formatSource('whatsapp_baileys')).toBe('WhatsApp');
    expect(formatSource('landing')).toBe('Landing Page');
    expect(formatSource('direct-wa')).toBe('WhatsApp Direto');
    expect(formatSource('messenger')).toBe('Messenger');
  });

  it('should handle case insensitivity', () => {
    expect(formatSource('Instagram')).toBe('Instagram');
    expect(formatSource('IG')).toBe('Instagram');
    expect(formatSource('WhatsApp_Baileys')).toBe('WhatsApp');
    expect(formatSource('fb_messenger')).toBe('Messenger');
    expect(formatSource('FB_MESSENGER')).toBe('Messenger');
  });

  it('should handle leading and trailing whitespace', () => {
    expect(formatSource(' instagram ')).toBe('Instagram');
    expect(formatSource('  ig')).toBe('Instagram');
    expect(formatSource('WhatsApp_Baileys   ')).toBe('WhatsApp');
  });

  it('should fall back to raw string if no map exists', () => {
    expect(formatSource('organic_search')).toBe('organic_search');
    expect(formatSource('Google')).toBe('Google');
  });

  it('should handle falsy values by returning Origem desconhecida', () => {
    expect(formatSource('')).toBe('Origem desconhecida');
    expect(formatSource(null)).toBe('Origem desconhecida');
    expect(formatSource(undefined)).toBe('Origem desconhecida');
  });
});
