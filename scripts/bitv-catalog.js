/**
 * BITV-Softwaretest Prüfschritt-Katalog
 * Basierend auf: https://www.bit-inklusiv.de/bitv-softwaretest/
 */

const BITV_CATALOG = {
  wahrnehmbarkeit: {
    title: "1. Wahrnehmbarkeit",
    description: "Informationen und Bestandteile der Benutzerschnittstelle müssen den Benutzern so präsentiert werden, dass sie diese wahrnehmen können.",
    steps: {
      "1.1.1": {
        id: "1.1.1",
        title: "Nicht-Text-Inhalte",
        description: "Alle Nicht-Text-Inhalte, die dem Benutzer präsentiert werden, haben eine Textalternative, die dem gleichen Zweck dient.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.2.1": {
        id: "1.2.1",
        title: "Nur-Audio und Nur-Video (aufgezeichnet)",
        description: "Für aufgezeichnete Nur-Audio- und Nur-Video-Medien gelten alternative Formate.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.2.2": {
        id: "1.2.2",
        title: "Untertitel (aufgezeichnet)",
        description: "Untertitel werden für alle aufgezeichneten Audio-Inhalte in synchronisierten Medien bereitgestellt.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.2.3": {
        id: "1.2.3",
        title: "Audiodeskription oder Volltext-Alternative (aufgezeichnet)",
        description: "Eine Alternative für zeitbasierte Medien oder eine Audiodeskription für aufgezeichnete Video-Inhalte wird bereitgestellt.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.2.4": {
        id: "1.2.4",
        title: "Untertitel (live)",
        description: "Untertitel werden für alle Live-Audio-Inhalte in synchronisierten Medien bereitgestellt.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.2.5": {
        id: "1.2.5",
        title: "Audiodeskription (aufgezeichnet)",
        description: "Audiodeskription wird für alle aufgezeichneten Video-Inhalte in synchronisierten Medien bereitgestellt.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.3.1": {
        id: "1.3.1",
        title: "Info und Beziehungen",
        description: "Informationen, Struktur und Beziehungen, die über die Darstellung vermittelt werden, können programmatisch bestimmt werden.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.3.2": {
        id: "1.3.2",
        title: "Bedeutungsvolle Reihenfolge",
        description: "Wenn die Reihenfolge, in der Inhalte präsentiert werden, sich auf deren Bedeutung auswirkt, kann die korrekte Lesereihenfolge programmatisch bestimmt werden.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.3.3": {
        id: "1.3.3",
        title: "Sensorische Eigenschaften",
        description: "Anweisungen zum Verstehen und Bedienen von Inhalten stützen sich nicht nur auf sensorische Eigenschaften der Komponenten.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.3.4": {
        id: "1.3.4",
        title: "Ausrichtung",
        description: "Inhalte beschränken ihre Ansicht und Bedienung nicht auf eine einzige Bildschirmausrichtung.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.3.5": {
        id: "1.3.5",
        title: "Eingabezweck identifizieren",
        description: "Der Zweck jedes Eingabefeldes, das Informationen über den Benutzer sammelt, kann programmatisch bestimmt werden.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.1": {
        id: "1.4.1",
        title: "Benutzung von Farbe",
        description: "Farbe wird nicht als einziges visuelles Mittel benutzt, um Informationen zu vermitteln.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.4.2": {
        id: "1.4.2",
        title: "Audio-Kontrolle",
        description: "Wenn Audio auf einer Webseite automatisch für mehr als 3 Sekunden abgespielt wird, ist entweder ein Mechanismus verfügbar, um das Audio anzuhalten oder stummzuschalten.",
        level: "A",
        category: "wahrnehmbarkeit"
      },
      "1.4.3": {
        id: "1.4.3",
        title: "Kontrast (Minimum)",
        description: "Die visuelle Darstellung von Text und Bildern von Text hat ein Kontrastverhältnis von mindestens 4,5:1.",
        level: "AA",
        category: "wahrnehmbarkeit"
      }
    }
  },

  bedienbarkeit: {
    title: "2. Bedienbarkeit",
    description: "Bestandteile der Benutzerschnittstelle und Navigation müssen bedienbar sein.",
    steps: {
      "2.1.1": {
        id: "2.1.1",
        title: "Tastatur",
        description: "Alle Funktionalitäten des Inhalts sind durch eine Tastaturschnittstelle bedienbar.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.1.2": {
        id: "2.1.2",
        title: "Keine Tastaturfalle",
        description: "Wenn der Tastaturfokus durch eine Tastaturschnittstelle auf einen Bestandteil der Seite bewegt werden kann, dann kann der Fokus von diesem Bestandteil weg bewegt werden.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.1.4": {
        id: "2.1.4",
        title: "Tastenkürzel",
        description: "Wenn ein Tastenkürzel implementiert wird, das nur aus Buchstaben, Interpunktionszeichen, Ziffern oder Symbolzeichen besteht, dann ist mindestens eine der folgenden Aussagen wahr.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.2.1": {
        id: "2.2.1",
        title: "Zeiteinteilung anpassbar",
        description: "Für jedes Zeitlimit, das vom Inhalt gesetzt wird, ist mindestens eine der folgenden Aussagen wahr.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.2.2": {
        id: "2.2.2",
        title: "Pausieren, beenden, ausblenden",
        description: "Für sich bewegende, blinkende, scrollende oder sich automatisch aktualisierende Informationen gelten alle folgenden Punkte.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.3.1": {
        id: "2.3.1",
        title: "Dreimaliges Blitzen oder weniger",
        description: "Webseiten enthalten nichts, was mehr als dreimal in einem Zeitraum von einer Sekunde blitzt.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.4.1": {
        id: "2.4.1",
        title: "Blöcke umgehen",
        description: "Ein Mechanismus ist verfügbar, um Blöcke von Inhalt zu umgehen, die auf verschiedenen Webseiten wiederholt werden.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.4.2": {
        id: "2.4.2",
        title: "Seite mit Titel versehen",
        description: "Webseiten haben Titel, die Thema oder Zweck beschreiben.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.4.3": {
        id: "2.4.3",
        title: "Fokus-Reihenfolge",
        description: "Wenn eine Webseite der Reihe nach navigiert werden kann und die Navigationsreihenfolgen die Bedeutung oder Bedienung beeinflussen, erhalten fokussierbare Komponenten den Fokus in einer Reihenfolge, die Bedeutung und Bedienbarkeit aufrecht erhält.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.4.4": {
        id: "2.4.4",
        title: "Linkzweck (im Kontext)",
        description: "Der Zweck jedes Links kann durch den Linktext allein oder durch den Linktext zusammen mit seinem programmatisch bestimmten Link-Kontext bestimmt werden.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.4.5": {
        id: "2.4.5",
        title: "Verschiedene Wege",
        description: "Es gibt mehr als einen Weg, um eine Webseite innerhalb eines Satzes von Webseiten zu finden.",
        level: "AA",
        category: "bedienbarkeit"
      },
      "2.4.6": {
        id: "2.4.6",
        title: "Überschriften und Beschriftungen",
        description: "Überschriften und Beschriftungen beschreiben Thema oder Zweck.",
        level: "AA",
        category: "bedienbarkeit"
      },
      "2.4.7": {
        id: "2.4.7",
        title: "Fokus sichtbar",
        description: "Jede durch Tastatur bedienbare Benutzerschnittstelle hat einen Bedienmodus, bei dem der Tastaturfokus sichtbar ist.",
        level: "AA",
        category: "bedienbarkeit"
      }
    }
  },

  verstaendlichkeit: {
    title: "3. Verständlichkeit",
    description: "Informationen und die Bedienung der Benutzerschnittstelle müssen verständlich sein.",
    steps: {
      "3.1.1": {
        id: "3.1.1",
        title: "Sprache der Seite",
        description: "Die voreingestellte menschliche Sprache jeder Webseite kann programmatisch bestimmt werden.",
        level: "A",
        category: "verstaendlichkeit"
      },
      "3.1.2": {
        id: "3.1.2",
        title: "Sprache von Teilen",
        description: "Die menschliche Sprache jedes Abschnitts oder jeder Phrase im Inhalt kann programmatisch bestimmt werden.",
        level: "AA",
        category: "verstaendlichkeit"
      },
      "3.2.1": {
        id: "3.2.1",
        title: "Bei Fokus",
        description: "Wenn irgendein Bestandteil der Benutzerschnittstelle den Fokus erhält, dann löst dies nicht eine Änderung des Kontextes aus.",
        level: "A",
        category: "verstaendlichkeit"
      },
      "3.2.2": {
        id: "3.2.2",
        title: "Bei Eingabe",
        description: "Die Änderung der Einstellung irgendeines Bestandteils der Benutzerschnittstelle führt nicht automatisch zur Änderung des Kontextes.",
        level: "A",
        category: "verstaendlichkeit"
      },
      "3.2.3": {
        id: "3.2.3",
        title: "Konsistente Navigation",
        description: "Navigationsmechanismen, die auf verschiedenen Webseiten innerhalb eines Satzes von Webseiten wiederholt werden, treten jedes Mal, wenn sie wiederholt werden, in der gleichen relativen Reihenfolge auf.",
        level: "AA",
        category: "verstaendlichkeit"
      },
      "3.2.4": {
        id: "3.2.4",
        title: "Konsistente Erkennung",
        description: "Bestandteile mit der gleichen Funktionalität innerhalb eines Satzes von Webseiten werden konsistent erkannt.",
        level: "AA",
        category: "verstaendlichkeit"
      },
      "3.3.1": {
        id: "3.3.1",
        title: "Fehlererkennung",
        description: "Wenn ein Eingabefehler automatisch erkannt wird, dann wird das fehlerhafte Element identifiziert und der Fehler wird dem Benutzer in Textform beschrieben.",
        level: "A",
        category: "verstaendlichkeit"
      }
    }
  },

  robustheit: {
    title: "4. Robustheit",
    description: "Inhalte müssen robust genug sein, damit sie von einer großen Auswahl an Benutzeragenten einschließlich assistierender Techniken interpretiert werden können.",
    steps: {
      "4.1.1": {
        id: "4.1.1",
        title: "Syntaxanalyse",
        description: "Bei Inhalt, der durch die Benutzung von Auszeichnungssprachen implementiert wird, haben Elemente vollständige Start- und End-Tags.",
        level: "A",
        category: "robustheit"
      },
      "4.1.2": {
        id: "4.1.2",
        title: "Name, Rolle, Wert",
        description: "Für alle Bestandteile der Benutzerschnittstelle können Name und Rolle programmatisch bestimmt werden.",
        level: "A",
        category: "robustheit"
      },
      "4.1.3": {
        id: "4.1.3",
        title: "Statusmeldungen",
        description: "Bei Inhalt, der mit Hilfe von Auszeichnungssprachen implementiert wird, können Statusmeldungen programmatisch durch Rollen oder Eigenschaften bestimmt werden.",
        level: "AA",
        category: "robustheit"
      }
    }
  },

  interoperabilitaet: {
    title: "5. Interoperabilität mit assistiven Technologien",
    description: "Software muss mit assistiven Technologien interoperabel sein.",
    steps: {
      "5.1.1": {
        id: "5.1.1",
        title: "Plattform-Accessibility-Services",
        description: "Software verwendet die Accessibility-Services der jeweiligen Plattform.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.1.2": {
        id: "5.1.2",
        title: "Keine Störung von Accessibility-Features",
        description: "Software stört keine aktivierten Accessibility-Features der Plattform oder der assistiven Technologien.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.1.3": {
        id: "5.1.3",
        title: "Accessibility-Services verfügbar",
        description: "Software stellt sicher, dass alle Accessibility-Services verfügbar sind, wenn assistive Technologien aktiv sind.",
        level: "A",
        category: "interoperabilitaet"
      }
      // Weitere 14 Prüfschritte der Interoperabilität...
    }
  }
};

/**
 * Hilfsfunktionen für BITV-Katalog
 */
const BitvCatalog = {
  /**
   * Alle Kategorien abrufen
   */
  getCategories() {
    return Object.keys(BITV_CATALOG).map(key => ({
      id: key,
      title: BITV_CATALOG[key].title,
      description: BITV_CATALOG[key].description
    }));
  },

  /**
   * Alle Prüfschritte einer Kategorie abrufen
   */
  getStepsByCategory(categoryId) {
    const category = BITV_CATALOG[categoryId];
    if (!category) return [];

    return Object.values(category.steps);
  },

  /**
   * Einzelnen Prüfschritt abrufen
   */
  getStep(stepId) {
    for (const category of Object.values(BITV_CATALOG)) {
      if (category.steps[stepId]) {
        return category.steps[stepId];
      }
    }
    return null;
  },

  /**
   * Alle Prüfschritte abrufen (flache Liste)
   */
  getAllSteps() {
    const steps = [];
    for (const category of Object.values(BITV_CATALOG)) {
      steps.push(...Object.values(category.steps));
    }
    return steps;
  },

  /**
   * Prüfschritte nach Level filtern
   */
  getStepsByLevel(level) {
    return this.getAllSteps().filter(step => step.level === level);
  },

  /**
   * Prüfschritt-Validierung
   */
  isValidStep(stepId) {
    return this.getStep(stepId) !== null;
  },

  /**
   * Kategorienamen aus stepId extrahieren
   */
  getCategoryFromStepId(stepId) {
    const step = this.getStep(stepId);
    return step ? step.category : null;
  }
};

// Export für Module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BITV_CATALOG, BitvCatalog };
}