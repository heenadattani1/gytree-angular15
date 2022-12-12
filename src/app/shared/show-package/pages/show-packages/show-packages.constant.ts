/**
* Method to change background color of the package card
*/
export const packageBackgroundColor = (index: number) => {
    var color = '';
    switch (index % 3) {
        case 0:
            color = 'card-red';
            break;
        case 1:
            color = 'card-purple';
            break;
        case 2:
            color = 'card-blue';
    }
    return color;
}
