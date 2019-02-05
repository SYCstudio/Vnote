# [IOI2008]Island
[BZOJ1791 Luogu4381]

你准备浏览一个公园，该公园由 $N$ 个岛屿组成，当地管理部门从每个岛屿 $i$ 出发向另外一个岛屿建了一座长度为 $L_i$ 的桥，不过桥是可以双向行走的。同时，每对岛屿之间都有一艘专用的往来两岛之间的渡船。相对于乘船而言，你更喜欢步行。你希望经过的桥的总长度尽可能长，但受到以下的限制：  
可以自行挑选一个岛开始游览。  
任何一个岛都不能游览一次以上。  
无论任何时间，你都可以由当前所在的岛 $S$ 去另一个从未到过的岛 $D$。从 $S$ 到 $D$ 有如下方法：
步行：仅当两个岛之间有一座桥时才有可能。对于这种情况，桥的长度会累加到你步行的总距离中。  
渡船：你可以选择这种方法，仅当没有任何桥和以前使用过的渡船的组合可以由 $S$ 走到 $D$ (当检查是否可到达时，你应该考虑所有的路径，包括经过你曾游览过的那些岛)。  
注意，你不必游览所有的岛，也可能无法走完所有的桥。  
请你编写一个程序，给定 $N$ 座桥以及它们的长度，按照上述的规则，计算你可以走过的桥的长度之和的最大值。

即求若干基环树的直径之和， 树上 DP+环上 DP 。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1000010;
const int maxM=maxN<<1;

int n;
int edgecnt=-1,Head[maxN],Next[maxM],V[maxM],W[maxM],Rw[maxN];
int rcnt=0,Ring[maxM],Fa[maxN];
int vis[maxM],Qp[maxM];
ll F[maxN],Qk[maxM],dp[maxN];

void Add_Edge(int u,int v,ll w);
void dfs(int u,int fa);
void dfsmx(int u,int fa,ll &mx);

int main(){
    scanf("%d",&n);mem(Head,-1);
    for (int i=1;i<=n;i++){
		int v,w;scanf("%d%d",&v,&w);
		Add_Edge(i,v,w);Add_Edge(v,i,w);
    }
    ll Ans=0;
    for (int i=1;i<=n;i++)
		if (vis[i]==0){
			rcnt=0;dfs(i,edgecnt+2);ll mx=0;
			for (int i=1;i<=rcnt;i++) vis[Ring[i]]=2,Rw[i]=0;
			for (int i=1;i<=rcnt;i++){
				dfsmx(Ring[i],0,mx);
				F[i]=dp[Ring[i]];
			}
			for (int i=1;i<=rcnt;i++) Ring[i+rcnt]=Ring[i];
			for (int i=1;i<=rcnt;i++)
				for (int j=Head[Ring[i]];j!=-1;j=Next[j])
					if (V[j]==Ring[i+1]) Rw[i]=max(Rw[i],W[j]);

			int ql=1,qr=0;ll sum=0;
			for (int i=1;i<rcnt+rcnt;i++){
				while (ql<=qr&&Qp[ql]<i-rcnt+1) ql++;
				if (ql<=qr) mx=max(mx,F[(i-1)%rcnt+1]+Qk[ql]+sum);
				while (ql<=qr&&Qk[qr]+sum<=F[(i-1)%rcnt+1]) --qr;
				++qr;Qk[qr]=F[(i-1)%rcnt+1]-sum;Qp[qr]=i;
				sum+=Rw[(i-1)%rcnt+1];
			}

			Ans+=mx;
		}
    printf("%lld\n",Ans);return 0;
}
void Add_Edge(int u,int v,ll w){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
    return;
}
void dfs(int u,int faw){
    Fa[u]=V[faw^1];vis[u]=1;
    for (int i=Head[u];i!=-1;i=Next[i])
		if (i!=(faw^1)){
			if (vis[V[i]]==0) dfs(V[i],i);
			else if (rcnt==0){
				int now=u;Ring[rcnt=1]=now;
				while (now!=V[i]) Ring[++rcnt]=now=Fa[now];
			}
		}
    return;
}
void dfsmx(int u,int fa,ll &mx){
    dp[u]=0;
    for (int i=Head[u];i!=-1;i=Next[i])
		if (V[i]!=fa&&vis[V[i]]!=2){
			dfsmx(V[i],u,mx);mx=max(mx,dp[u]+dp[V[i]]+W[i]);
			dp[u]=max(dp[u],dp[V[i]]+W[i]);
		}
    mx=max(mx,dp[u]);
    return;
}
```