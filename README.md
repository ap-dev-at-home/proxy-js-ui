# Proxy-Js-UI

WebComponents based on [proxy-js](https://github.com/ap-dev-at-home/proxy-js).

## select-sheet

WebComponent displaying a set of options to select from.

### Constructor

```javascript
new Select({  
    title: 'Title'        //the title        - displayed in the sheets header
    items: [],            //array of objects - the items to provide selection from
                          //                 - the 'text' property will be displayed as the items representation
    cancel: 'CANCEL'      //                 - cancel button label
});
```

### Events

```javascript
//close - custom event
e.detail = 
{
    action: ''    // - close action 
                  // - 'select'  - closed by item selection
                  // - 'cancel'  - closed by cancel click
                  // - 'unfocus' - closed by loosing focus
    item: {}      // - selected item
}
```

### Example
```javascript
//usage example
import { SelectSheet } from '/lib/proxy-js-ui/select-sheet.js';

$shell.menu = {};
$shell.menu.sheet = async function (title, items) {
    const $bg = createSafeBg();     //HTML Element covering all site, providing safe background
    document.body.appendChild($bg);
    $bg.focus();
    
    const promise = new Promise((resolve, reject) => {
        const selectSheet = new SelectSheet({ title: title, cancel: 'CANCEL', items: items })

        $p.event.one(selectSheet, 'close', e => {
            if (document.body.querySelector('.busy-bg')) {
                $bg.parentElement.removeChild($bg);
            }

            resolve(e.detail);
        });

        $bg.appendChild(selectSheet);
    });

    return promise;
};

//----------------------------------------------------------------------------------------
//show sheet
$shell.menu.sheet('Sort By...', 
[   //selectable items
    { text: 'File Name - Ascending', sort: 'name', direction: 'asc' }, ..., ..., ...
])
.then(select => { 
    console.log(select);
    
    if (select.action != 'select') { //close action
        return;
    }

    //do something with -> select.item
});

```
### Sample Image
![Sample](https://github.com/ap-dev-at-home/proxy-js-ui/blob/main/Images/select-sheet.png)

