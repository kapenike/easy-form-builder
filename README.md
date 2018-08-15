# Easy Form Builder

View a Working Verion: (http://kapenike.com/local_code/form-builder/example.html)

This application is meant to be a total solution for form building and data capture. Once a form has been created, it can be called from a PHP script that converts the builder into a data capture form. Data captured can be stored in the easy form builder save object, or passed to a custom function to be dealt with how the developer pleases.

This is a work in progress. Currently, I have only completed the form builder. I have quite a bit more to complete for this to be a working version, but stay tuned. This will be completed very soon. Maybe you can help me?

### Remaining Features for V.1 Release
- [ ] Append "required" checkbox to Create Input menu and store inside new input container as hidden field
- [ ] Allow data restrictions to be made on text inputs (Ex. valid email, character length). Values stored as hidden fields
- [ ] Create a Save/Load system using AJAX. This system must save the response from `efb_saveMenu`, then create two more versions. One being the front-end form (so remove all unnecessary data like hidden fields and easy form builder class names). The second being an object that represents the inputs created with their hidden values as properties.
- [ ] Create a front-end form viewer that translates the two additional save datas into a working data capture form. This needs to account for the multiple form pages and allow for data collected on previous pages to be used on other pages (Ex. `{{page_1.INPUT_NAME}}` ).
- [ ] Create new row type on form builder titled "Duplicate Section". Any inputs created in this section will be translated into array inputs on the front-end form capture (`INPUT_NAME[]`) and will include a feature to duplcate the entire section or remove one.
- [ ] Offer a generic storage option for form  data inside the easy form builder instance save file. These results should be viewable from the form builder itself.

## Getting Started
Include `easy-form-builder.js`, `easy-form-builder.css` and any version of Bootstrap in your HTML file. I have included v3.3.6 becuase it has nicer generic colors than the current version.
Once you have these files included, creating an easy form builder instance is simple...
- Create a `div` with a unique id
- Create a `script` tag under this div and call the function `initialize_easy_form_builder()`;
  - This function takes two parameters:
    1. The id of the div above
    2. The easy form builder object you would like to load in (pass null for a clean slate)
    
### Example
```
<div id="easy_form_builder"></div>
<script>
  initialize_easy_form_builder('easy_form_builder',null);
</script>
```
