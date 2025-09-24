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
      },
      "1.4.4": {
        id: "1.4.4",
        title: "Textgröße ändern",
        description: "Text kann ohne Hilfstechnologie auf bis zu 200% vergrößert werden, ohne dass dabei Inhalt oder Funktionalität verloren geht.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.5": {
        id: "1.4.5",
        title: "Schriftgrafiken",
        description: "Wenn die verwendeten Techniken die visuelle Präsentation bewerkstelligen können, wird für die Vermittlung von Informationen Text statt Schriftgrafiken verwendet.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.10": {
        id: "1.4.10",
        title: "Umbruch der Inhalte",
        description: "Inhalte können ohne horizontales Scrollen bei einer Breite von 320 CSS-Pixeln dargestellt werden.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.11": {
        id: "1.4.11",
        title: "Nicht-Text Kontrast",
        description: "Die visuelle Darstellung von grafischen Objekten und Teilen von grafischen Objekten hat ein Kontrastverhältnis von mindestens 3:1 zu angrenzenden Farben.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.12": {
        id: "1.4.12",
        title: "Textabstand anpassbar",
        description: "Bei Inhalten, die mit Markup-Sprachen implementiert sind, geht kein Inhalt oder keine Funktionalität verloren, wenn Textabstände angepasst werden.",
        level: "AA",
        category: "wahrnehmbarkeit"
      },
      "1.4.13": {
        id: "1.4.13",
        title: "Eingeblendete Inhalte",
        description: "Wenn das Zeigen oder Verbergen von zusätzlichen Inhalten durch Hover oder Fokus ausgelöst wird, dann gelten bestimmte Bedingungen.",
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
      },
      "2.5.1": {
        id: "2.5.1",
        title: "Zeigergesten",
        description: "Alle Funktionalitäten, die Multipoint- oder pfadbasierte Gesten für die Bedienung verwenden, können auch mit einem einzigen Zeiger ohne pfadbasierte Geste bedient werden.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.5.2": {
        id: "2.5.2",
        title: "Zeiger-Stornierung",
        description: "Für Funktionalitäten, die mit einem einzigen Zeiger bedient werden können, ist mindestens eine der folgenden Aussagen wahr.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.5.3": {
        id: "2.5.3",
        title: "Beschriftung im Namen",
        description: "Bei Benutzerschnittstellen-Komponenten mit Beschriftungen, die Text oder Bilder von Text enthalten, beinhaltet der Name den Text, der visuell dargestellt wird.",
        level: "A",
        category: "bedienbarkeit"
      },
      "2.5.4": {
        id: "2.5.4",
        title: "Bewegungsaktivierung",
        description: "Funktionalitäten, die durch Bewegung des Geräts oder durch Benutzerbewegung aktiviert werden können, können auch durch Benutzerschnittstellen-Komponenten bedient werden.",
        level: "A",
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
      },
      "3.3.2": {
        id: "3.3.2",
        title: "Beschriftungen oder Anweisungen",
        description: "Beschriftungen oder Anweisungen werden bereitgestellt, wenn der Inhalt eine Benutzereingabe verlangt.",
        level: "A",
        category: "verstaendlichkeit"
      },
      "3.3.3": {
        id: "3.3.3",
        title: "Fehlervorschlag",
        description: "Wenn ein Eingabefehler automatisch erkannt wird und Korrekturvorschläge bekannt sind, dann werden die Vorschläge dem Benutzer bereitgestellt.",
        level: "AA",
        category: "verstaendlichkeit"
      },
      "3.3.4": {
        id: "3.3.4",
        title: "Fehlervermeidung (rechtlich, finanziell, Daten)",
        description: "Für Webseiten, die rechtliche Verpflichtungen oder finanzielle Transaktionen für den Benutzer zur Folge haben, ist mindestens eine der folgenden Aussagen wahr.",
        level: "AA",
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
      "5.1": {
        id: "5.1",
        title: "Assistenztechnologien (geschlossene Funktionalität)",
        description: "Prüfung der Assistenztechnologien bei geschlossener Funktionalität.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.1": {
        id: "5.2.1",
        title: "Plattformunterstützung von Barrierefreiheitsdiensten für Software mit einer Benutzungsschnittstelle",
        description: "Software mit einer Benutzungsschnittstelle unterstützt die Barrierefreiheitsdienste der Plattform.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.2": {
        id: "5.2.2",
        title: "Plattformunterstützung von Barrierefreiheitsdiensten für Assistenztechnologien",
        description: "Plattformunterstützung für Assistenztechnologien wird bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.3": {
        id: "5.2.3",
        title: "Verwendung von Barrierefreiheitsdiensten",
        description: "Software verwendet verfügbare Barrierefreiheitsdienste der Plattform.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.4": {
        id: "5.2.4",
        title: "Assistenztechnologie",
        description: "Software unterstützt den Einsatz von Assistenztechnologien.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.5": {
        id: "5.2.5",
        title: "Objektinformationen",
        description: "Objektinformationen werden für Assistenztechnologien bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.6": {
        id: "5.2.6",
        title: "Zeile, Spalte und Kopfzeilen",
        description: "Informationen über Zeilen, Spalten und Kopfzeilen werden bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.7": {
        id: "5.2.7",
        title: "Werte",
        description: "Werte von UI-Elementen werden für Assistenztechnologien zugänglich gemacht.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.8": {
        id: "5.2.8",
        title: "Label-Beziehungen",
        description: "Beziehungen zwischen Labels und UI-Elementen werden bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.9": {
        id: "5.2.9",
        title: "Eltern-Kind-Beziehungen",
        description: "Hierarchische Beziehungen zwischen UI-Elementen werden bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.10": {
        id: "5.2.10",
        title: "Text",
        description: "Textinformationen werden für Assistenztechnologien bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.11": {
        id: "5.2.11",
        title: "Liste der verfügbaren Handlungen",
        description: "Verfügbare Aktionen werden für Assistenztechnologien aufgelistet.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.12": {
        id: "5.2.12",
        title: "Ausführung verfügbarer Handlungen",
        description: "Verfügbare Aktionen können durch Assistenztechnologien ausgeführt werden.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.13": {
        id: "5.2.13",
        title: "Verfolgung von Fokus- und Auswahlattributen",
        description: "Fokus- und Auswahlzustände werden für Assistenztechnologien bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.14": {
        id: "5.2.14",
        title: "Änderung der Fokus- und Auswahlattribute",
        description: "Änderungen von Fokus- und Auswahlzuständen werden ermöglicht.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.15": {
        id: "5.2.15",
        title: "Änderungsbenachrichtigung",
        description: "Änderungen werden an Assistenztechnologien kommuniziert.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.16": {
        id: "5.2.16",
        title: "Änderungen von Zuständen und Eigenschaften",
        description: "Änderungen von UI-Element-Zuständen und -Eigenschaften werden bereitgestellt.",
        level: "A",
        category: "interoperabilitaet"
      },
      "5.2.17": {
        id: "5.2.17",
        title: "Änderungen von Werten und Text",
        description: "Änderungen von Werten und Textinhalten werden an Assistenztechnologien übermittelt.",
        level: "A",
        category: "interoperabilitaet"
      }
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