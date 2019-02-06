# [2009国家集训队]拯救Protoss的故乡
[BZOJ2040]

在星历2012年，星灵英雄Zeratul预测到他所在的Aiur行星在M天后会发生持续性暴雨灾害，尤其是他们的首都。而Zeratul作为星灵族的英雄，当然是要尽自己最大的努力帮助星灵族渡过这场自然灾害。要渡过这场自然灾害，Zeratul自然要安排很多很多事情，其中一件就是将雨水疏导到大海里去。星灵族在重建家园的时候建造了N条河流，这些河流连接了共N+1个城市，当然其中包括了星灵首都。城市的编号为0…N，星灵首都的编号为0。当然水流是有方向的，除了星灵首都以外，其余的城市都有且仅有一条河流流入。如果一个城市没有流出去的河流，那么这个城市就是一个沿海城市，可以认为流入这个城市的河流是直接流入大海的。聪明的星灵族在建造河流的时候是不会让其出现环状结构的，也就是说所有的河流都是能够流入大海的。每一条河流都是有一个最大流量的，一旦超过这个最大流量，就会发生洪水灾害。因此从星灵首都流入大海的总水流量是有一个最大值的。例如有3条河流：第一条是从城市0流向城市1，最大流量为4；第二条是从城市1流向城市2，最大流量为2；第三条是从城市1流向城市3，最大流量为3。此时从星灵首都(城市0)流入大海的总水流量最大为4，方案有两种： A. 第一条河流的流量为4，第二条河流的流量为2，第三条河流的流量为2。 B. 第一条河流的流量为4，第二条河流的流量为1，第三条河流的流量为3。由于离暴雨到来还有时间，因此Zeratul可以扩大某些河流的最大流量来使得从星灵首都流入大海的总水流量增大。比如将上面这个例子的第一条河流的最大流量增大1，那么从星灵首都流入大海的总流水量也可以增大1，变成了5。当然将河流的最大流量扩大是需要时间的，将一条河流的最大流量扩大1所需要的时间为1天。离暴雨到来还有M天，因此Zeratul也有M天的时间来扩大河流的最大流量。不过由于河流周围的地形限制，每条河流并不是能够无限扩大的，因此每条河流的可以扩大到的最大流量也是有限制的。而此时Zeratul正忙着安排别的工作，因此他将这个艰巨的任务交给了你。你需要安排一种方案，使得从星灵首都流入大海的总水流量最大。不过现在你只需要告诉Zeratul这个最大值即可。

首先可以很容易地得到一个费用流的模型。然后观察题目，是一棵树，那么就不会存在退流的问题，直接用树链剖分+线段树来模拟费用流。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

#define ls (x<<1)
#define rs (ls|1)
#define ft first
#define sd second
#define mp make_pair
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=10100;
const int maxM=maxN<<1;
const int inf=1000000000;

class SegmentData{
public:
    int mnflow,mnleaf,dflow,dcost,fob;
};

int n,M;
int edgecnt=0,Head[maxN],Next[maxM],V[maxM];
pair<int,int> W[maxM],FaW[maxM];
int Sz[maxN],Hs[maxN],Top[maxN],Fa[maxN];
int dfncnt,dfn[maxN],lst[maxN],idfn[maxN];
SegmentData S[maxN<<2];
int top=0,St[maxN],use[maxN];

void Add_Edge(int u,int v,pair<int,int> w);
void dfs1(int u);
void dfs2(int u,int top);
void Update(int x);
void PushDown(int x);
void Build(int x,int l,int r);
int Querylf(int x,int l,int r);
int Queryc(int x,int l,int r,int p);
int Querymn(int x,int l,int r,int ql,int qr);
void Incflow(int x,int l,int r,int ql,int qr,int f);
void Inccost(int x,int l,int r,int ql,int qr,int c);
void Setfob(int x,int l,int r,int ql,int qr);

int main(){
    scanf("%d%d",&n,&M);mem(Head,-1);
    for (int i=1;i<=n;i++){
	int u,v,a,b;scanf("%d%d%d%d",&u,&v,&a,&b);
	Add_Edge(u,v,mp(a,b));Add_Edge(v,u,mp(a,b));
    }
    
    for (int i=Head[0];i!=-1;i=Next[i]) FaW[V[i]]=W[i],dfs1(V[i]),dfs2(V[i],V[i]);

    Build(1,1,n);
    
    int Ans=0;
    while (1){
	if (S[1].mnleaf>=inf) break;
	int leaf=idfn[Querylf(1,1,n)];
	int now=leaf,cost=Queryc(1,1,n,dfn[leaf]),flow=inf;

	while (now){
	    flow=min(flow,Querymn(1,1,n,dfn[Top[now]],dfn[now]));
	    now=Fa[Top[now]];
	}

	if (flow==0) break;

	if (flow*cost>M){
	    Ans+=M/cost;break;
	}
	Ans+=flow;M-=flow*cost;

	now=leaf;top=0;
	while (now){
	    Incflow(1,1,n,dfn[Top[now]],dfn[now],-flow);
	    now=Fa[Top[now]];
	}

	for (int i=1;i<=top;i++){
	    int u=St[i];
	    if (use[u]) Setfob(1,1,n,dfn[u],lst[u]);
	    else{
		use[u]=1;
		Incflow(1,1,n,dfn[u],dfn[u],FaW[u].sd-FaW[u].ft);
		Inccost(1,1,n,dfn[u],lst[u],1);
	    }
	}
    }
    printf("%d\n",Ans);return 0;
}
void Add_Edge(int u,int v,pair<int,int> w){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;W[edgecnt]=w;
    return;
}
void dfs1(int u){
    Sz[u]=1;
    for (int i=Head[u];i!=-1;i=Next[i])
	if (V[i]!=Fa[u]){
	    Fa[V[i]]=u;FaW[V[i]]=W[i];
	    dfs1(V[i]);Sz[u]+=Sz[V[i]];
	    if (Sz[V[i]]>Sz[Hs[u]]) Hs[u]=V[i];
	}
    return;
}
void dfs2(int u,int top){
    Top[u]=top;idfn[dfn[u]=++dfncnt]=u;
    if (Hs[u]){
	dfs2(Hs[u],top);
	for (int i=Head[u];i!=-1;i=Next[i])
	    if (V[i]!=Fa[u]&&V[i]!=Hs[u])
		dfs2(V[i],V[i]);
    }
    lst[u]=dfncnt;return;
}
void Update(int x){
    S[x].mnflow=min(S[ls].mnflow,S[rs].mnflow);
    S[x].mnleaf=min(S[ls].mnleaf,S[rs].mnleaf);
    return;
}
void PushDown(int x){
    if (S[x].fob){
	S[ls].fob=S[rs].fob=1;S[ls].dflow=S[ls].dcost=S[rs].dflow=S[rs].dcost=0;
	S[ls].mnleaf=S[rs].mnleaf=S[ls].mnflow=S[rs].mnflow=inf;
	S[x].fob=0;
    }
    if (S[x].dflow){
	S[ls].mnflow+=S[x].dflow;S[ls].dflow+=S[x].dflow;
	S[rs].mnflow+=S[x].dflow;S[rs].dflow+=S[x].dflow;
	S[x].dflow=0;
    }
    if (S[x].dcost){
	S[ls].mnleaf+=S[x].dcost;S[ls].dcost+=S[x].dcost;
	S[rs].mnleaf+=S[x].dcost;S[rs].dcost+=S[x].dcost;
	S[x].dcost=0;
    }
    return;
}
void Build(int x,int l,int r){
    if (l==r){
	S[x].mnflow=FaW[idfn[l]].ft;
	if (Hs[idfn[l]]==0) S[x].mnleaf=0;
	else S[x].mnleaf=inf;
	return;
    }
    int mid=(l+r)>>1;
    Build(ls,l,mid);Build(rs,mid+1,r);
    Update(x);return;
}
int Querylf(int x,int l,int r){
    if (l==r) return l;
    int mid=(l+r)>>1;PushDown(x);
    if (S[x].mnleaf==S[ls].mnleaf) return Querylf(ls,l,mid);
    else return Querylf(rs,mid+1,r);
}
int Queryc(int x,int l,int r,int p){
    if (l==r) return S[x].mnleaf;
    int mid=(l+r)>>1;PushDown(x);
    if (p<=mid) return Queryc(ls,l,mid,p);
    else return Queryc(rs,mid+1,r,p);
}
int Querymn(int x,int l,int r,int ql,int qr){
    if (l==ql&&r==qr) return S[x].mnflow;
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) return Querymn(ls,l,mid,ql,qr);
    else if (ql>=mid+1) return Querymn(rs,mid+1,r,ql,qr);
    else return min(Querymn(ls,l,mid,ql,mid),Querymn(rs,mid+1,r,mid+1,qr));
}
void Incflow(int x,int l,int r,int ql,int qr,int f){
    if (l==ql&&r==qr){
	if (S[x].mnflow+f==0){
	    if (l==r){
		St[++top]=idfn[l];S[x].mnflow+=f;
		return;
	    }
	}
	else{
	    S[x].mnflow+=f;S[x].dflow+=f;
	    return;
	}
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Incflow(ls,l,mid,ql,qr,f);
    else if (ql>=mid+1) Incflow(rs,mid+1,r,ql,qr,f);
    else Incflow(ls,l,mid,ql,mid,f),Incflow(rs,mid+1,r,mid+1,qr,f);
    Update(x);return;
}
void Inccost(int x,int l,int r,int ql,int qr,int c){
    if (l==ql&&r==qr){
	S[x].mnleaf+=c;S[x].dcost+=c;
	return;
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Inccost(ls,l,mid,ql,qr,c);
    else if (ql>=mid+1) Inccost(rs,mid+1,r,ql,qr,c);
    else Inccost(ls,l,mid,ql,mid,c),Inccost(rs,mid+1,r,mid+1,qr,c);
    Update(x);return;
}
void Setfob(int x,int l,int r,int ql,int qr){
    if (l==ql&&r==qr){
	S[x].fob=1;S[x].mnleaf=S[x].mnflow=inf;S[x].dcost=S[x].dflow=0;
	return;
    }
    int mid=(l+r)>>1;PushDown(x);
    if (qr<=mid) Setfob(ls,l,mid,ql,qr);
    else if (ql>=mid+1) Setfob(rs,mid+1,r,ql,qr);
    else Setfob(ls,l,mid,ql,mid),Setfob(rs,mid+1,r,mid+1,qr);
    Update(x);return;
}
```