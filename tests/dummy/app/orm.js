import { ORM } from 'redux-orm';
import Dress from './orm-models/dress';
import Performance from './orm-models/performance';
import Song from './orm-models/song';
import Vocaloid from './orm-models/vocaloid';

const orm = new ORM();
orm.register(Dress, Performance, Song, Vocaloid);

export default orm;
