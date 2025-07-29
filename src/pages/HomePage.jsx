import HeroSectionComponent from '../components/Herosection.jsx';
import MovieSectionComponent from '../components/MovieSection.jsx';
import Nav from '../components/NavSection.jsx';
import TrendingSectionComponent from '../components/TrendingSection.jsx';


export default function HomePage() {

    


    return (
       <div className="mx-auto  text-gray-50">
        <Nav />
        <HeroSectionComponent/>
        <TrendingSectionComponent/>

        <MovieSectionComponent Stitle={'All Movies'} />
       </div>

    );

}