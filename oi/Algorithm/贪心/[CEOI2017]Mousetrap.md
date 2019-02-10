# [CEOI2017]Mousetrap
[Luogu4654]

有一个有 $n$ 个房间和 $n-1$ 条走廊的迷宫，保证任意两个房间可以通过走廊互相到达，换句话说，这个迷宫的结构是一棵树。  
一个老鼠被放进了迷宫，迷宫的管理者决定和老鼠做个游戏。  
一开始，有一个房间被放置了陷阱，老鼠出现在另一个房间。老鼠可以通过走廊到达别的房间，但是会弄脏它经过的走廊。老鼠不愿意通过脏的走廊。  
每个时刻，管理者可以进行一次操作：堵住一条走廊使得老鼠不能通过，或者擦干净一条走廊使得老鼠可以通过。然后老鼠会通过一条干净的并且没被堵住的走廊到达另一个房间。只有在没有这样的走廊的情况下，老鼠才不会动。一开始所有走廊都是干净的。管理者不能疏通已经被堵住的走廊。  
现在管理者希望通过尽量少的操作将老鼠赶到有陷阱的房间，而老鼠则希望管理者的操作数尽量多。请计算双方都采取最优策略的情况下管理者需要的操作数量。  
注意：管理者可以选择在一些时刻不操作。

以陷阱所在的房间为树的根，变为有根树。考虑老鼠会如何行动，它的选择一定是直接走进某个子树或者向上走一段再进入某个子树，并且可以确定的是老鼠进入某个子树后就一定出不来了，最后会被困在某个叶子节点。先计算这部分的贡献，在某个节点时，老鼠一定会选择一个代价尽量大的儿子走，而又因为管理员先操作，所以老鼠的选择一定是次大。设 F[i] 表示老鼠从进入到 i 的子树到重新回到 i 的最小代价，转移就是从次大转移过来。  
接下来考虑老鼠会选择哪个子树走进去。直接计算不好算，考虑二分答案转化为判定性问题，此时老鼠的目标就变成使得管理员的操作次数大于二分的 limit ，那么它只要找到一个使得接下来的代价超过 limit 的子树钻进去就行了，而管理员则需要在老鼠来之前就把这样的边堵上。预处理老鼠到根路径上的后缀和，二分判断。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=1010000;
const int maxM=maxN<<1;

int n,S,T;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM],D[maxN];
int Fa[maxN],F[maxN],top,Seq[maxN],Cnt[maxN];

void Add_Edge(int u,int v);
void dfs(int u);
bool check(int limit);

int main(){
    scanf("%d%d%d",&n,&T,&S);mem(Head,-1);
    for (int i=1;i<n;i++){
	int u,v;scanf("%d%d",&u,&v);
	Add_Edge(u,v);Add_Edge(v,u);
    }

    dfs(T);

    int now=S;while (now) Seq[++top]=now,now=Fa[now];
    for (int i=top-1;i>=1;i--) Cnt[i]=Cnt[i+1]+D[Seq[i]]-2;
    ++Cnt[1];

    int l=0,r=n+n,mid,Ans=0;
    while (l<=r) check(mid=(l+r)>>1)?(Ans=mid,r=mid-1):l=mid+1;

    printf("%d\n",Ans);return 0;
}

void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;++D[u];
    return;
}
void dfs(int u){
    int mx=0,mxx=0;
    for (int i=Head[u];i!=-1;i=Next[i])
	if (V[i]!=Fa[u]){
	    Fa[V[i]]=u;dfs(V[i]);
	    if (F[V[i]]>=mx) mxx=mx,mx=F[V[i]];
	    else if (F[V[i]]>mxx) mxx=F[V[i]];
	}
    F[u]=mxx+D[u]-1;return;
}
bool check(int limit){
    int sum=0;
    for (int i=1;i<top;i++){
	int u=Seq[i],tot=0;
	for (int j=Head[u];j!=-1;j=Next[j])
	    if (V[j]!=Seq[i-1]&&V[j]!=Seq[i+1])
		tot+=(F[V[j]]+Cnt[i]>limit);
	limit-=tot;sum+=tot;
	if (limit<0||sum>i) return 0;
    }
    return 1;
}
```