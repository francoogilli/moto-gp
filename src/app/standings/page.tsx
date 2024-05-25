import { fetchStandings } from '../../lib/api';
import Aprilia from '@/icons/aprilia';
import Ducati from '@/icons/ducati';
import Honda from '@/icons/honda';
import KTM from '@/icons/ktm';
import Yamaha from '@/icons/yamaha';

const teamColors: { [key: string]: string } = {
  'Aprilia Racing': 'bg-gradient-to-r from-[#5BB339] via-[#5BB339] to-[#32601F]',
  'Ducati Lenovo Team': 'bg-gradient-to-r from-[#d90404] via-[#d90404] to-[#6C0000]',
  'Gresini Racing MotoGP': 'bg-gradient-to-r from-[#9AB3ED] via-[#9AB3ED] to-[#546174] text-black',
  'HRC Test Team': 'bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA] to-[#919191] text-black',
  'CASTROL Honda LCR': 'bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA] to-[#919191] text-black',
  'Monster Energy Yamaha MotoGP Team': 'bg-gradient-to-r from-[#0C358A] via-[#0C358A] to-[#161D26]',
  'Pertamina Enduro VR46 Racing Team': 'bg-gradient-to-r from-[#E1FF01] via-[#E1FF01] to-[#798A00] text-black',
  'Prima Pramac Racing': 'bg-gradient-to-r from-[#7D33BA] via-[#7D33BA] to-[#35234D]',
  'Red Bull GASGAS Tech3': 'bg-gradient-to-r from-[#9A0626] via-[#9A0626] to-[#520414]',
  'Red Bull KTM Factory Racing': 'bg-gradient-to-r from-[#FF6600] via-[#FF6600] to-[#893600]',
  'Repsol Honda Team': 'bg-gradient-to-r from-[#FFA00F] via-[#FFA00F] to-[#022358]',
  'Trackhouse Racing': 'bg-gradient-to-r from-[#0066CC] via-[#0066CC] to-[#01468a]',
  'IDEMITSU Honda LCR': 'bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA] to-[#919191] text-black',
};

const getTeamColor = (teamName: string) => {
  return teamColors[teamName] || 'bg-gray-500';
};

const splitName = (fullName: string) => {
  const parts = fullName.split(' ');
  const firstName = parts[0];
  const lastName = parts.slice(1).join(' ');
  return { firstName, lastName };
};

const teamBrand: { [key: string]: string } = {
  'Ducati Lenovo Team': 'Ducati',
  'Prima Pramac Racing': 'Ducati',
  'Gresini Racing MotoGP': 'Ducati',
  'Pertamina Enduro VR46 Racing Team': 'Ducati',
  'Red Bull GASGAS Tech3': 'KTM',
  'Red Bull KTM Factory Racing': 'KTM',
  'Aprilia Racing': 'Aprilia',
  'Trackhouse Racing': 'Aprilia',
  'Monster Energy Yamaha MotoGP Team': 'Yamaha',
  'Repsol Honda Team': 'Honda',
  'IDEMITSU Honda LCR': 'Honda'
};

const getTeamIcon = (teamName: string) => {
  const brand = teamBrand[teamName];
  if (brand === 'Ducati') {
    return <Ducati />;
  } else if (brand === 'KTM') {
    return <KTM />;
  } else if (brand === 'Aprilia') {
    return <Aprilia />;
  } else if (brand === 'Yamaha') {
    return <Yamaha />;
  } else if (brand === 'Honda') {
    return <Honda />;
  }

  return null;
};

interface Rider {
  number: string;
  full_name: string;
}

interface Team {
  name: string;
}

interface Classification {
  id: string;
  position: number;
  points: number;
  rider: Rider;
  team: Team;
}

interface Standings {
  classification: Classification[];
}

export default async function ResultsPage() {
  let standings: Standings;
  try {
    standings = await fetchStandings();
  } catch (error: unknown) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div className="text-red-500">Failed to fetch standings: {errorMessage}</div>;
  }

  const leaderPoints = standings.classification[0]?.points || 0;
  const secondPoints = standings.classification[1]?.points || 0;
  const pointsDifferenceWithSecond = leaderPoints - secondPoints;

  return (
    <div className="container mx-auto p-4">
      <h1 className='md:mb-10 mb-6 text-white text-center text-4xl md:text-6xl -tracking-tighter uppercase'>Riders' <span className='font-bold'>Championship</span></h1>
      

      {standings.classification.slice(0, 1).map((item: Classification, index: number) => {
        return (
          <div key={item.id} className='text-white grid grid-cols-1 md:grid-cols-2 gap-x-5 pb-5'>
            <div className='flex justify-center items-center rounded-2xl gap-x-6 bg-gradient-to-r from-[#35234D] via-[#7D33BA] to-[#35234D]'>
              <img src="/89.png" width={130} className='md:w-[130px] w-[90px]' alt="" />
              <p className='transform md:text-8xl text-6xl pb-2 md:pb-4 uppercase font-bold text-transparent' style={{ WebkitTextStroke: '2px white', fontFamily: 'MotoGP-Display' }}>Leader</p>
            </div>
            <div className='hidden md:flex md:text-6xl text-4xl uppercase rounded-2xl pb-2 md:pb-2 font-bold text-transparent justify-center items-center bg-gradient-to-r from-[#059505] via-[#1ada1a] to-[#059505]' 
                style={{ WebkitTextStroke: '2px white', fontFamily: 'MotoGP-Display' }}> GAP to Leader&nbsp; 
                <span className='md:text-6xl text-4xl  text-white'> +{pointsDifferenceWithSecond}</span>
            </div>
          </div>
          
        );
      })}

      {standings.classification.map((item: Classification, index: number) => {
        const { firstName, lastName } = splitName(item.rider.full_name);
        const pointsDifference = leaderPoints - item.points;
        return (
          <div key={item.id} className={`hover:bg-gradient-to-r hover:opacity-90 transition-opacity duration-150 rounded-lg flex justify-between items-center md:mb-3 mb-2.5 ${getTeamColor(item.team.name)} ${getTeamColor(item.team.name).includes('text-black') ? 'text-black' : 'text-white'}`}>
            <div className='flex items-center'>
              <div className=' pl-1.5 py-1.5 font-bold'>
                <div className='rounded-[4px] bg-black text-2xl md:text-4xl pb-1 text-white flex justify-center items-center size-10'>{item.position}</div>
              </div>
              <div className='flex flex-col md:pb-1 pl-2'>
                {/* <p className=''>{firstName}</p> */}
                <p className='font-bold uppercase text-xl md:text-3xl -tracking-tighter'><span className='hidden md:inline capitalize -tracking-tight font-medium'>{firstName} </span>{lastName}</p>
              </div>
                <img src={`/${item.rider.number}.png`} className='hidden md:inline-block ml-2' width={50} alt="" />
              
              
            </div>
            <div className='flex items-center'>
              <span className='mr-5'>{getTeamIcon(item.team.name)}</span>
              {index === 0 ? (
                <div className='px-4 h-[3.25rem] w-[6.5rem] flex justify-center items-center rounded-r-lg font-bold text-4xl bg-[#171717] text-white'>{item.points}</div>
              ) : (
                <>
                  <div className='py-3.5 pl-1 w-[2.5rem] flex justify-center items-center text-base bg-[#fff] text-black'>
                    <span className='mr-2'>{pointsDifference === 0 ? '-' : `-${pointsDifference}`}</span>
                  </div>
                  <div className='px-4 py-2.5 w-[4rem] flex justify-center items-center rounded-r-lg font-bold text-2xl bg-[#171717] text-white'>{item.points}</div>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  );
}
