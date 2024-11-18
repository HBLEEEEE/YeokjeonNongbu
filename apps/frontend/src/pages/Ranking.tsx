import { Rank } from '@/types/Index';

const rank: Rank[] = [
  { rank: 1, name: '김철수', assets: 500000 },
  { rank: 2, name: '이영희', assets: 400000 },
  { rank: 3, name: '박지민', assets: 350000 },
  { rank: 4, name: '정상우', assets: 300000 },
  { rank: 5, name: '최은지', assets: 250000 }
];

const Ranking: React.FC = () => {
  return (
    <main className="flex flex-row justify-center items-center min-h-screen gap-24 select-none">
      <section className="flex flex-col gap-4 z-[10]">
        {rank.length === 0 ? (
          <div className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-8 w-[350px]">
            <p className="flex flex-col text-black text-lg font-bold">랭킹 정보가 없습니다.</p>
          </div>
        ) : (
          <>
            {rank.map(user => (
              <article
                className="flex flex-col items-center bg-light-beige border-4 border-light-pink rounded-2xl p-2 w-[350px]"
                key={user.rank}
              >
                <ul className="w-full">
                  <li className="flex items-center w-full py-2 px-4 gap-4">
                    <span className="flex justify-center items-center w-12 h-12 text-red-soft text-2xl font-bold">
                      {user.rank === 1 ? (
                        <img src="/first.png" alt="1등" className="w-12 h-12" />
                      ) : user.rank === 2 ? (
                        <img src="second.png" alt="2등" className="w-12 h-12" />
                      ) : user.rank === 3 ? (
                        <img src="/third.png" alt="3등" className="w-12 h-12" />
                      ) : (
                        `${user.rank}`
                      )}
                    </span>
                    <div className="flex flex-col text-black text-lg font-bold">
                      <span>{user.name}</span>
                      <span>￦ {user.assets.toLocaleString()}</span>
                    </div>
                  </li>
                </ul>
              </article>
            ))}
          </>
        )}
      </section>

      <section className="flex flex-col gap-4 z-[10]">
        <article className="flex flex-col text-center items-center bg-light-beige border-4 border-light-pink rounded-2xl w-[350px] gap-8 p-8">
          <div>
            <p className="text-xl font-medium">내등수</p>
            <p className="text-2xl font-bold text-red-soft">10000</p>
          </div>
          <div>
            <p className="text-3xl font-bold">상위 56%</p>
          </div>
          <div>
            <p className="text-xl font-semibold">농부왕</p>
            <p className="text-xl font-semibold">￦ 932,517,456</p>
          </div>
        </article>
      </section>
    </main>
  );
};

export default Ranking;
