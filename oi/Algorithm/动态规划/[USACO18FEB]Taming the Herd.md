# [USACO18FEB]Taming the Herd
[BZOJ5196 Luogu4267]

一大清早，Farmer John就被木材破裂的声音吵醒了。是这些奶牛们干的，她们又逃出牛棚了！
Farmer John已经厌烦了奶牛在清晨出逃，他觉得受够了：是时候采取强硬措施了。他在牛棚的墙上钉了一个计数器，追踪从上次出逃开始经过的天数。所以如果某一天早上发生了出逃事件，这一天的计数器就为$0$；如果最近的出逃是$3$天前，计数器读数就为$3$。Farmer John一丝不苟地记录了每一天计数器的读数。  
年末到了，Farmer John准备做一些统计。他说，你们这些奶牛会付出代价的！然而他的某些记录看上去不太对劲……  
Farmer John想要知道从他开始记录以来发生过多少次出逃。但是，他怀疑这些奶牛篡改了它的记录，现在他所确定的只有他是从发生出逃的某一天开始记录的。请帮助他求出，对于每个从他开始记录以来可能发生的出逃次数，他被篡改了的记录条数的最小值。

由于要求每一种出逃次数的被篡改的最小值，设 F[i][j][k] 表示前 i 个记录中，有 j 次出逃，其中上一次出逃为 k 的最小篡改值。则分两种情况转移，当 k==i 时，从 min(F[i-1][j-1][]) 中转移过来，代价为 Rc[i] 是否等于 0 ，这个可以前缀最小值优化到 O(1) 转移；当 k!=i 时，从 F[i-1][j][k] 转移过来，代价为 Rc[i] 是否等于 i-k 。这样单次的转移就是 O(1) 的了。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=110;
const int inf=2147483647;

int n;
int Rc[maxN];
int F[maxN][maxN][maxN],Mn[maxN][maxN],Ans[maxN];

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Rc[i]);

	mem(F,63);mem(Mn,63);
	F[0][0][0]=0;Mn[0][0]=0;
	for (int i=1;i<=n;i++){
		Ans[i]=inf;
		for (int j=1;j<=i;j++){
			Mn[i][j]=inf;
			for (int k=i;k>=j;k--){
				if (k==i) F[i][j][k]=Mn[i-1][j-1]+(Rc[i]!=0);
				else F[i][j][k]=F[i-1][j][k]+(Rc[i]!=i-k);
				Mn[i][j]=min(Mn[i][j],F[i][j][k]);
			}
		}
	}

	for (int i=1;i<=n;i++)
		for (int j=1;j<=n;j++)
			Ans[i]=min(Ans[i],F[n][i][j]);
	for (int i=1;i<=n;i++) printf("%d\n",Ans[i]);
	return 0;
}
```