# [USACO18FEB]Snow Boots G
[BZOJ5194 Luogu4269]

到冬天了，这意味着下雪了！从农舍到牛棚的路上有$N$块地砖，方便起见编号为$1 \dots N$，第$i$块地砖上积了$f_i$英尺的雪。  
在Farmer John的农舍的地窖中，总共有$B$双靴子，编号为$1 \dots B$。其中某些比另一些结实，某些比另一些轻便。具体地说，第$i$双靴子能够让FJ在至多$s_i$英尺深的积雪中行走，能够让FJ每步至多前进$d_i$。  
Farmer John从$1$号地砖出发，他必须到达$N$号地砖才能叫醒奶牛们。$1$号地砖在农舍的屋檐下，$N$号地砖在牛棚的屋檐下，所以这两块地砖都没有积雪。帮助Farmer John求出哪些靴子可以帮助他走完这段艰辛的路程。

把地砖和靴子都按照积雪深度排序，用一个 set 维护当前靴子能够走的位置，另一个 set 维护能走的位置的差。若差的最大值小于靴子的跨越长度，则说明可行，否则不行。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<set>
using namespace std;

class Boot
{
public:
	int s,d,id;
};

const int maxN=101000;
const int inf=2147483647;

int n,B;
Boot Bt[maxN];
pair<int,int> Block[maxN];
set<int> Pos;
multiset<int> H;
int Ans[maxN];

bool cmp(Boot P,Boot Q);

int main(){
	scanf("%d%d",&n,&B);
	for (int i=1;i<=n;i++) scanf("%d",&Block[i].first),Block[i].second=i;
	for (int i=1;i<=B;i++) scanf("%d%d",&Bt[i].s,&Bt[i].d),Bt[i].id=i;
	Block[1].first=Block[n].first=-1;

	sort(&Block[1],&Block[n+1]);
	sort(&Bt[1],&Bt[B+1],cmp);

	Pos.insert(1);Pos.insert(n);
	H.insert(n-1-1);
	for (int i=1,j=3;i<=B;i++){
		while ((j<=n)&&(Block[j].first<=Bt[i].s)){
			int pos=Block[j].second;
			Pos.insert(pos);
			int lst=*(--Pos.find(pos)),nxt=*(++Pos.find(pos));
			H.erase(H.find(nxt-lst-1));
			H.insert(pos-lst-1);H.insert(nxt-pos-1);
			j++;
		}
		if ((*(--H.end()))>=Bt[i].d) Ans[Bt[i].id]=0;
		else Ans[Bt[i].id]=1;
	}
	for (int i=1;i<=B;i++) printf("%d\n",Ans[i]);return 0;
}

bool cmp(Boot P,Boot Q){
	return P.s<Q.s;
}
```
