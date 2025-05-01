
let searchbar, table;
const rows = [];

let data;

Promise.all(
    [
        new Promise(resolve => {
            window.onload = () => {
                searchbar = document.querySelector('#search');
                table = document.querySelector('tbody');

                resolve();
            }
        }),
        fetch('./data.json').then(r => r.json()).then(r => data = r)
    ]
).then(init);

function init() {
    data.forEach((x, i) => {
        const row = document.createElement('tr');

        addCell(x, row, 'turns');
        addCell(x, row, 'seconds', { text:  x.turns * 0.5 });
        addCell(x, row, 'pokemon', { title: x.pokemon, link: `https://pokemongo.gamepress.gg/c/pokemon/${x.pId}` });
        addCell(x, row, 'fast', { link: `https://pokemongo.gamepress.gg/c/moves/${x.fId}` });
        addCell(x, row, 'charge', { link: `https://pokemongo.gamepress.gg/c/moves/${x.cId}` });
        addCell(x, row, 'excessEnergy', { class: 'excess' });
        // addCell(x, row, 'firstEarlyActivation', { class: 'early' });

        rows.push({ search: `${x.pokemon}|${x.fast}|${x.charge}`.toLowerCase(), element: row });

        table.append(row);
    });

    searchbar.addEventListener('input', searchUpdate);
}

function addCell(pokemon, rowElement, field, opts={}) {
    const element = document.createElement('td');

    if(opts.link) {
        const linkElement = document.createElement('a');

        linkElement.href = opts.link;
        linkElement.innerText = opts.text || (pokemon[field] === 0 && field !== 'excessEnergy' ? '' : pokemon[field]);

        element.append(linkElement);
    } else {
        element.innerText = opts.text || (pokemon[field] === 0 && field !== 'excessEnergy' ? '' : pokemon[field]);
    }

    if(opts.title) {
        element.title = opts.title;
    }

    element.classList.add(opts.class || field);

    rowElement.append(element)
}

function searchUpdate() {
    let searchTerm = searchbar.value.toLowerCase().trim();

    let lastConnectedRow = null;

    rows.forEach(row => {
        let matches = !searchTerm || row.search.includes(searchTerm);

        if(matches && row.element.classList.contains('removed')) {
            row.element.classList.remove('removed')
        } else if(!matches && !row.element.classList.contains('removed')) {
            row.element.classList.add('removed');
        }

        if(matches) {
            lastConnectedRow = row.element;
        }
    });
}
