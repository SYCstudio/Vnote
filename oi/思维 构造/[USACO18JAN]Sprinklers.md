# [USACO18JAN]Sprinklers
[BZOJ5187 Luogu4184]

农夫约翰有块田，这块田可视为一个 $N×N$ 的正方形网格。西南角为 $(0,0)$ ，东北角为 $(N-1, N-1)$ 。  
在某些格子中有双头喷头，每一个都能够同时喷洒水和肥料。一个位于 $(i,j)$ 的双头喷头会  
将水洒在所有满足 $N≥x≥i,$ $N≥y≥j$ 的格子 $(x,y)$ 上；  
将肥料洒在所有满足 $0≤x≤i$ 和 $0≤y≤j$ 的格子 $(x,y)$ 上。  
农民约翰想在这块田里切割出一个矩形种甜玉米。矩形的边不能把格子切开。矩形内的所有格子都必须能由双头喷头灌溉和施肥。  
求切割矩形的方案数。由于这个数字可能很大，所以输出对 $10^9+7$ 取模。

首先可以发现，若对每一个 y 维护一个关于 x 的可行区域，记为 $[up _ y,down _ y ]$ 可以发现， up 和 down 两者都是单调不升的。这个可以用 O(n) 的时间预处理。  
然后考虑如何计算答案。枚举列 y ，计算左边所有能与 y 这一列组合答案的矩形，假设为 (x1,y1),(x2,y) 。若不考虑 $y1 \in [up _ {x1} down _ {x1}]$ 这一条件时得到的答案就是 $y \times (down _ y-up _ y+1)(down _ y -up _ y +2)/2$ 。然后考虑减去那些 $y1 < up _ {x1}$ 的答案，发现其实就是每一行左边空出来的那些地方的解。记 $P[i]$ 表示第 i 行左边空出来的连续的无法种植植物的格子个数，则不合法的方案应该为 $P[down _ y]+2P[down _ y-1]+3P[down _ y-2]$ ，发现是一个 P[i] 乘以一个等差数列的形式，那么可以 O(n) 地用前缀和来维护， O(1) 的截取。用前面总共的减去这里不合法的就是合法的部分。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeofArr)

const int maxN=101000;
const int Mod=1e9+7;
const int inf=2147483647;

int n;
int Up[maxN],Down[maxN],P[maxN],Q[maxN],Left[maxN],Sum[maxN];

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++){
		int x,y;scanf("%d%d",&x,&y);x++;y++;
		P[x]=y;Q[y]=x;
	}

	Up[1]=Q[1];
	for (int i=2;i<n;i++) Up[i]=min(Q[i],Up[i-1]);
	Down[n-1]=Q[n];
	for (int i=n-2;i>=1;i--) Down[i]=max(Down[i+1],Q[i+1]);
	for (int i=1;i<n;i++) Down[i]--;

	P[1];
	for (int i=2;i<n;i++) P[i]=min(P[i],P[i-1]);
	for (int i=1;i<n;i++) Sum[i]=(Sum[i-1]+P[i]-1)%Mod,Left[i]=(Left[i-1]+Sum[i])%Mod;

	ll Ans=0;
	for (int i=1;i<n;i++)
		if (Down[i]>=Up[i]){
			ll key1=1ll*(Down[i]-Up[i]+1)*(Down[i]-Up[i]+2)/2%Mod*i%Mod;
			ll key2=(Left[Down[i]]-1ll*Sum[Up[i]-1]*(Down[i]-Up[i]+1)%Mod-Left[Up[i]-1]+Mod)%Mod;
			Ans=((Ans+key1-key2)%Mod+Mod)%Mod;
		}
	printf("%lld\n",Ans);return 0;
}
```