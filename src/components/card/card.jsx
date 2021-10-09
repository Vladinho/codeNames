import classNames from "classnames/bind";
import spyBackground from '../../images/spy-male.png'
import personBackground from '../../images/person-male-skin-type-3.png'
import killBackground from '../../images/venom-head.png'

const Card = ({word, onClick, color, isOpened = false }) => {
    let background;
    switch (color) {
        case '#ccc':
            background = personBackground;
         break;
        case 'black':
            background = killBackground;
            break;
        default:
            background = spyBackground;
    }
    return (
        <div
            className={classNames('card', 'animate__animated', {'animate__flipInY': isOpened})}
            onClick={onClick} style={{
                backgroundColor: color,
                backgroundImage: `url(${isOpened && background})`,
                backgroundBlendMode: background === killBackground ? 'unset' : 'soft-light'
        }}>
            <div className={'word'}>{word}</div>
            <div className={'word'}>{word}</div>
        </div>
    )
}

export default Card;