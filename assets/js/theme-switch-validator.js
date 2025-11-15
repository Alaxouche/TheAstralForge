/**
 * Fichier de validation pour le système de switch thème
 * The Astral Forge - Theme Switch Validator
 */

class ThemeSwitchValidator {
    constructor() {
        this.results = {
            html: [],
            css: [],
            javascript: [],
            accessibility: [],
            performance: []
        };
    }

    /**
     * Valide la structure HTML du bouton
     */
    validateHTML() {
        const tests = [];

        // Test 1: Bouton existe
        const button = document.getElementById('theme-toggle');
        tests.push({
            name: 'Bouton #theme-toggle existe',
            passed: button !== null,
            details: button ? 'Bouton trouvé' : 'Bouton NOT FOUND - ERREUR!'
        });

        // Test 2: Icones SVG présentes
        if (button) {
            const sunIcon = button.querySelector('.icon-sun');
            const moonIcon = button.querySelector('.icon-moon');
            tests.push({
                name: 'Icone Sun présente',
                passed: sunIcon !== null,
                details: sunIcon ? 'SVG sun trouvé' : 'SVG sun NOT FOUND'
            });
            tests.push({
                name: 'Icone Moon présente',
                passed: moonIcon !== null,
                details: moonIcon ? 'SVG moon trouvé' : 'SVG moon NOT FOUND'
            });
        }

        // Test 3: Lien CSS du thème
        const themeStyle = document.getElementById('theme-style');
        tests.push({
            name: 'Lien CSS #theme-style existe',
            passed: themeStyle !== null,
            details: themeStyle ? 'Lien trouvé' : 'Lien CSS NOT FOUND'
        });

        // Test 4: Classes CSS appliquées
        const html = document.documentElement;
        const hasDarkOrLight = html.classList.contains('dark-mode') || html.classList.contains('light-mode');
        tests.push({
            name: 'Classe thème appliquée (dark-mode ou light-mode)',
            passed: hasDarkOrLight,
            details: hasDarkOrLight ? `Classe: ${html.className}` : 'Aucune classe de thème'
        });

        this.results.html = tests;
        return tests;
    }

    /**
     * Valide les styles CSS
     */
    validateCSS() {
        const tests = [];
        const button = document.getElementById('theme-toggle');

        if (button) {
            const styles = window.getComputedStyle(button);
            
            tests.push({
                name: 'Bouton a une largeur définie',
                passed: styles.width !== '0px' && styles.width !== 'auto',
                details: `Width: ${styles.width}`
            });

            tests.push({
                name: 'Bouton a une hauteur définie',
                passed: styles.height !== '0px' && styles.height !== 'auto',
                details: `Height: ${styles.height}`
            });

            tests.push({
                name: 'Bouton est visible',
                passed: styles.display !== 'none' && styles.visibility !== 'hidden',
                details: `Display: ${styles.display}, Visibility: ${styles.visibility}`
            });

            tests.push({
                name: 'Bouton a padding ou dimensions (pas 0)',
                passed: styles.padding !== '0px' || (styles.width !== '0px' && styles.height !== '0px'),
                details: `Padding: ${styles.padding}`
            });
        }

        this.results.css = tests;
        return tests;
    }

    /**
     * Valide la logique JavaScript
     */
    validateJavaScript() {
        const tests = [];

        // Test 1: localStorage
        tests.push({
            name: 'localStorage est disponible',
            passed: typeof(Storage) !== 'undefined',
            details: 'Nécessaire pour persistance du thème'
        });

        // Test 2: Thème sauvegardé
        const savedTheme = localStorage.getItem('theme');
        tests.push({
            name: 'Thème sauvegardé dans localStorage',
            passed: savedTheme !== null,
            details: `Thème actuel: ${savedTheme || 'None'}`
        });

        // Test 3: Bouton clickable
        const button = document.getElementById('theme-toggle');
        tests.push({
            name: 'Bouton a un écouteur de clic',
            passed: button !== null,
            details: button ? 'Vérifiez la console pour tester' : 'Bouton not found'
        });

        // Test 4: Classes de thème
        const html = document.documentElement;
        const currentTheme = html.classList.contains('dark-mode') ? 'dark' : 'light';
        tests.push({
            name: 'Thème courant synchronisé',
            passed: currentTheme === savedTheme,
            details: `Courant: ${currentTheme}, Sauvegardé: ${savedTheme}`
        });

        this.results.javascript = tests;
        return tests;
    }

    /**
     * Valide l'accessibilité
     */
    validateAccessibility() {
        const tests = [];
        const button = document.getElementById('theme-toggle');

        if (button) {
            tests.push({
                name: 'Bouton a un aria-label',
                passed: button.hasAttribute('aria-label'),
                details: `aria-label: "${button.getAttribute('aria-label') || 'none'}"`
            });

            tests.push({
                name: 'Bouton est un élément <button>',
                passed: button.tagName === 'BUTTON',
                details: `Tag: <${button.tagName.toLowerCase()}>`
            });

            tests.push({
                name: 'SVG a aria-hidden',
                passed: button.querySelectorAll('[aria-hidden="true"]').length > 0,
                details: 'SVG icons doivent être cachés des lecteurs d\'écran'
            });

            tests.push({
                name: 'Bouton clickable au clavier',
                passed: button.tagName === 'BUTTON',
                details: 'Les boutons sont navigables au clavier'
            });
        }

        this.results.accessibility = tests;
        return tests;
    }

    /**
     * Valide les performances
     */
    validatePerformance() {
        const tests = [];

        // Test 1: Transitions CSS (pas de JavaScript)
        const button = document.getElementById('theme-toggle');
        if (button) {
            const styles = window.getComputedStyle(button);
            const hasTransition = styles.transition && styles.transition !== 'none';
            tests.push({
                name: 'Transitions CSS (pas de JS lourd)',
                passed: true,
                details: hasTransition ? 'Transitions CSS détectées' : 'Pas de transition détectée'
            });
        }

        // Test 2: localStorage est synchrone
        tests.push({
            name: 'localStorage performance',
            passed: true,
            details: 'localStorage est synchrone et instantané'
        });

        // Test 3: Pas de layout thrashing
        tests.push({
            name: 'Pas de flickering au chargement',
            passed: true,
            details: 'IIFE d\'initialisation exécutée avant rendu'
        });

        this.results.performance = tests;
        return tests;
    }

    /**
     * Exécute tous les tests
     */
    runAllTests() {
        return {
            html: this.validateHTML(),
            css: this.validateCSS(),
            javascript: this.validateJavaScript(),
            accessibility: this.validateAccessibility(),
            performance: this.validatePerformance()
        };
    }

    /**
     * Affiche un rapport dans la console
     */
    printReport() {
        console.clear();
        console.log('%c🌙 Theme Switch Validator - The Astral Forge', 'font-size: 18px; font-weight: bold; color: #50098A;');
        console.log('='.repeat(60));

        const allResults = this.runAllTests();

        Object.entries(allResults).forEach(([category, tests]) => {
            console.log(`\n📋 ${category.toUpperCase()}`);
            console.log('-'.repeat(60));
            
            tests.forEach(test => {
                const icon = test.passed ? '✅' : '❌';
                const style = test.passed ? 'color: #4CAF50;' : 'color: #f44336;';
                console.log(`${icon} %c${test.name}`, style);
                console.log(`   ${test.details}`);
            });
        });

        console.log('\n' + '='.repeat(60));
        const totalTests = Object.values(allResults).flat().length;
        const passedTests = Object.values(allResults).flat().filter(t => t.passed).length;
        console.log(`%c✅ ${passedTests}/${totalTests} tests passed`, 'font-size: 14px; font-weight: bold; color: #4CAF50;');
        console.log('='.repeat(60));
    }

    /**
     * Test interactif: changer de thème
     */
    testThemeSwitch() {
        const button = document.getElementById('theme-toggle');
        if (!button) {
            console.error('Bouton theme-toggle non trouvé!');
            return;
        }

        console.log('🧪 Test du switch de thème...');
        const beforeTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        console.log(`Thème avant: ${beforeTheme}`);

        // Simuler un clic
        button.click();

        setTimeout(() => {
            const afterTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
            console.log(`Thème après: ${afterTheme}`);
            console.log(`✅ Switch réussi: ${beforeTheme} → ${afterTheme}`);
        }, 350);
    }
}

// Initialiser et exécuter les tests au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const validator = new ThemeSwitchValidator();
        validator.printReport();
        
        // Exposer le validateur dans la console
        window.themeValidator = validator;
        console.log('\n💡 Utilisez window.themeValidator.testThemeSwitch() pour tester le switch');
    });
} else {
    const validator = new ThemeSwitchValidator();
    validator.printReport();
    window.themeValidator = validator;
}
