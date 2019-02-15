# 林克卡特树lct
[BZOJ5252 Luogu4383]

小L 最近沉迷于塞尔达传说：荒野之息（The Legend of Zelda: Breath of The Wild）无法自拔，他尤其喜欢游戏中的迷你挑战。  
游戏中有一个叫做“LCT” 的挑战，它的规则是这样子的：现在有一个N 个点的 树（Tree），每条边有一个整数边权vi ，若vi >= 0，表示走这条边会获得vi 的收益；若vi < 0 ，则表示走这条边需要支付- vi 的过路费。小L 需要控制主角Link 切掉（Cut）树上的 恰好K 条边，然后再连接 K 条边权为 0 的边，得到一棵新的树。接着，他会选择树上的两个点p; q ，并沿着树上连接这两点的简单路径从p 走到q ，并为经过的每条边支付过路费/ 获取相应收益。  
海拉鲁大陆之神TemporaryDO 想考验一下Link。他告诉Link，如果Link 能切掉 合适的边、选择合适的路径从而使 总收益 - 总过路费最大化的话，就把传说中的大师之剑送给他。  
小 L 想得到大师之剑，于是他找到了你来帮忙，请你告诉他，Link 能得到的 总收益 - 总过路费最大是多少。

切掉 $K$ 条边再连一条边后选一条路径，相当于是在原树中选择点不相交的 $K+1$ 条路径。那么首先可以得到一个 $O(nk)$ 的转移动态规划算法，其中$k$那一维是关于题目中 $K$ 的限制的。考虑如何去掉这个限制。考虑连通块的个数与答案的关系，随着连通块个数的增加，答案是先变大后变小，并且可以证明其斜率是单调不升的。那么可以给每一个连通块一个代价 $x$ ，这个代价越大，连通块的个数越少，否则越多。以此来控制连通块的个数。于是就可以想到带权二分，二分这个代价，做一遍树型 $DP$ ，求出最优解状态下的连通块个数，移动二分边界。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=301000;
const int maxM=maxN<<1;
const int inf=2147483647;
const ll INF=1e17;

class Data
{
public:
	ll key,cnt;
};

int n,K;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],W[maxM];
Data Ans,F[maxN][3];

void Add_Edge(int u,int v,int w);
int Calc(ll limit);
void dfs(int u,int fa,ll limit);
bool operator < (Data A,Data B);
Data operator + (Data A,Data B);
void Update(Data &A,Data B);

int main(){
	mem(Head,-1);
	ll Mx=0,Mn=0;
	scanf("%d%d",&n,&K);K++;
	for (int i=1;i<n;i++){
		int u,v,w;scanf("%d%d%d",&u,&v,&w);
		Add_Edge(u,v,w);Add_Edge(v,u,w);
		Mx+=abs(w);Mn-=abs(w);
	}

	ll L=Mn,R=Mx,pos=0;
	do{
		ll mid=(L+R)>>1;
		if (Calc(mid)>=K) pos=mid,L=mid+1;
		else R=mid-1;
	}
	while (L<=R);

	Calc(pos);

	printf("%lld\n",Ans.key+1ll*K*pos);

	return 0;
}

void Add_Edge(int u,int v,int w){
	Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
	return;
}

int Calc(ll limit){
	dfs(1,1,limit);
	Ans=((Data){-INF,0});
	for (int i=1;i<=n;i++) Update(Ans,max(F[i][0],max(F[i][1],F[i][2])));
	return Ans.cnt;
}

void dfs(int u,int fa,ll limit){
	F[u][0]=((Data){0,0});F[u][1]=((Data){-limit,1});F[u][2]=((Data){-INF,0});
	for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa){
			int v=V[i],w=W[i];
			dfs(v,u,limit);
			Data P=max(F[v][0],max(F[v][1],F[v][2]));
			Update(F[u][2],F[u][2]+P);
			Update(F[u][2],F[u][1]+F[v][1]+((Data){w+limit,-1}));
			Update(F[u][1],F[u][1]+P);
			Update(F[u][1],F[u][0]+F[v][1]+((Data){w,0}));
			Update(F[u][1],F[u][0]+F[v][0]+((Data){-limit,1}));
			Update(F[u][0],F[u][0]+P);
		}
	return;
}

bool operator < (Data A,Data B){
	if (A.key!=B.key) return A.key<B.key;
	else return A.cnt<B.cnt;
}

Data operator + (Data A,Data B){
	return ((Data){A.key+B.key,A.cnt+B.cnt});
}

void Update(Data &A,Data B){
	if (A<B) A=B;
}
```