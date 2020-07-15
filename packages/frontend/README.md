# Frontend

## Directory structure

### core
Contains all services, models and interceptors of the application.

### pages
Contains all pages of the application

### shared
Contains all components that are used in multiple module

## CLI

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

#### Generate a new Page
For a home page: `ng g component -m pages pages/home`

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### i18n
In the HTML, all the texts that need to be translated must look like this : ``<p class="login__slogan" i18n="login slogan@@loginSlogan">Log in and manage your club!</p>``

The syntax is i18n="Description@@ID"

To generate the file containing all the translable text: ´´ng xi18n --output-path src/i18n´´

Then a new file from the one above must be created. like message.fr.xlf and all `source` tag have to be follow by a `target` tag with the translation. Exemple:
´´
<source>Warning !</source><target>Attention!</target>
´´
To build the app in another language: ´´ng build --aot --i18n-file=src/i18n/messages.fr.xlf --i18n-locale=fr --i18n-format=xlf´´
