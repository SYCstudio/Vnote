# Mashmokh's Designed Problem
[CF414E]

给定一棵$n$个节点的有根树，每个点连出的边都有序，共有m个操作。（n &lt;= 10^5,m &lt;= 10^5）  
操作有：  
1.查询两个点u,v的距离  
2.以$v$为根的子树从树中分开，并添加一条与其第$h$个祖先的连边作为该祖先的最后一个儿子。  
3.查询从一个点出发，按边的顺序进行dfs,深度为$k$的最后遍历的点

先从根出发得到欧拉序，然后用 Splay 维护这个序列。（这个好像就是 ETT Euler Tour Tree?）  
剩下的操作均可以以 Splay 维护序列完成。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

const int maxN=402000;
const int inf=2000000000;

class Splay{
public:
    int ch[2],fa,sz,eo,key,mn,mx,pls;
};

int n,Q,rt;
vector<int> E[maxN];
int eucnt,Eu[maxN],lft[maxN],rht[maxN],Dep[maxN];
Splay S[maxN];

void dfs_init(int u);
void Update(int x);
void PushDown(int x);
void Plus(int x,int key);
int Build(int l,int r);
void Rotate(int x);
void Splay(int x,int goal);
int Rank(int x);
int Pre(int x);
int Nxt(int x);
int main(){
    scanf("%d%d",&n,&Q);
    for (int i=1;i<=n;i++){
	int sz,u;scanf("%d",&sz);
	while (sz--){
	    scanf("%d",&u);E[i].push_back(u);
	}
    }
    dfs_init(1);
    rt=Build(1,eucnt);

    int ncnt=eucnt+2;
    while (Q--){
	int opt;scanf("%d",&opt);
	if (opt==1){
	    int u,v,l,r,d1,d2;scanf("%d%d",&u,&v);
	    Splay(lft[u],0);d1=S[lft[u]].key;
	    Splay(lft[v],0);d2=S[lft[v]].key;
	    if (Rank(lft[u])<Rank(lft[v])) l=lft[u];else l=lft[v];
	    if (Rank(rht[u])>Rank(rht[v])) r=rht[u];else r=rht[v];
	    l=Pre(l);r=Nxt(r);
	    Splay(l,0);Splay(r,l);
	    printf("%d\n",d1+d2-S[S[r].ch[0]].mn*2);
	}
	if (opt==2){
	    int u,h,d,l,r,p;scanf("%d%d",&u,&h);
	    Splay(lft[u],0);d=S[lft[u]].key;
	    int now=S[lft[u]].ch[0];
	    while (1){
		PushDown(now);
		if (S[now].ch[1]&&S[S[now].ch[1]].mn<=d-h&&S[S[now].ch[1]].mx>=d-h) now=S[now].ch[1];
		else if (S[now].eo&&S[now].key==d-h) break;
		else now=S[now].ch[0];
	    }
	    int anc=Eu[now];now=rht[Eu[now]];
	    l=Pre(lft[u]);r=Nxt(rht[u]);
	    Splay(l,0);Splay(r,l);p=S[r].ch[0];
	    S[r].ch[0]=S[p].fa=0;Plus(p,1-h);

	    ++ncnt;Splay(now,0);S[ncnt].key=S[now].key;Update(ncnt);
	    r=Nxt(now);rht[anc]=ncnt;S[ncnt].eo=1;Eu[ncnt]=anc;
	    Splay(now,0);Splay(r,now);S[r].ch[0]=ncnt;S[ncnt].fa=r;Splay(ncnt,0);

	    Splay(now,0);Splay(ncnt,now);
	    S[ncnt].ch[0]=p;S[p].fa=ncnt;Splay(p,0);
	}
	if (opt==3){
	    int k;scanf("%d",&k);
	    int now=rt;
	    while (1){
		PushDown(now);
		if (S[now].ch[1]&&S[S[now].ch[1]].mn<=k&&S[S[now].ch[1]].mx>=k) now=S[now].ch[1];
		else if (S[now].eo&&S[now].key==k) break;
		else now=S[now].ch[0];
	    }
	    Splay(now,0);
	    printf("%d\n",Eu[now]);
	}
    }
    return 0;
}
void dfs_init(int u){
    Eu[lft[u]=++eucnt]=u;
    for (int i=0,sz=E[u].size();i<sz;i++) Dep[E[u][i]]=Dep[u]+1,dfs_init(E[u][i]),Eu[rht[u]=++eucnt]=u;
    if (!E[u].size()) Eu[rht[u]=++eucnt]=u;
    return;
}
void Update(int x){
    S[x].mn=inf;S[x].mx=-inf;S[x].sz=1;
    if (S[x].eo) S[x].mn=min(S[x].mn,S[x].key),S[x].mx=max(S[x].mx,S[x].key);
    if (S[x].ch[0]) S[x].mn=min(S[x].mn,S[S[x].ch[0]].mn),S[x].mx=max(S[x].mx,S[S[x].ch[0]].mx),S[x].sz+=S[S[x].ch[0]].sz;
    if (S[x].ch[1]) S[x].mn=min(S[x].mn,S[S[x].ch[1]].mn),S[x].mx=max(S[x].mx,S[S[x].ch[1]].mx),S[x].sz+=S[S[x].ch[1]].sz;
    return;
}
void PushDown(int x){
    if (S[x].pls){
	if (S[x].ch[0]) Plus(S[x].ch[0],S[x].pls);
	if (S[x].ch[1]) Plus(S[x].ch[1],S[x].pls);
	S[x].pls=0;
    }
    return;
}
void Plus(int x,int key){
    S[x].pls+=key;S[x].mn+=key,S[x].mx+=key,S[x].key+=key;
    return;
}
int Build(int l,int r){
    int mid=(l+r)>>1;
    if (mid==1) S[mid].ch[0]=eucnt+1,S[eucnt+1].fa=mid,Update(eucnt+1);
    if (mid==eucnt) S[mid].ch[1]=eucnt+2,S[eucnt+2].fa=mid,Update(eucnt+2);
    S[mid].key=S[mid].mn=S[mid].mx=Dep[Eu[mid]];S[mid].eo=1;
    if (l<mid){
	S[mid].ch[0]=Build(l,mid-1);
	S[S[mid].ch[0]].fa=mid;
    }
    if (mid<r){
	S[mid].ch[1]=Build(mid+1,r);
	S[S[mid].ch[1]].fa=mid;
    }
    Update(mid);return mid;
}
void Rotate(int x){
    int y=S[x].fa,z=S[y].fa;
    int sx=(x==S[y].ch[1]),sy=(y==S[z].ch[1]);
    S[x].fa=z;if (z) S[z].ch[sy]=x;
    S[y].ch[sx]=S[x].ch[sx^1];if (S[x].ch[sx^1]) S[S[x].ch[sx^1]].fa=y;
    S[y].fa=x;S[x].ch[sx^1]=y;
    Update(y);return;
}
void Splay(int x,int goal){
    static int St[maxN],top;top=0;
    int now=x;while (now) St[++top]=now,now=S[now].fa;
    while (top) PushDown(St[top--]);
    while (S[x].fa!=goal){
	int y=S[x].fa,z=S[y].fa;
	if (z!=goal)
	    ((x==S[y].ch[0])^(y==S[z].ch[0]))?Rotate(x):Rotate(y);
	Rotate(x);
    }
    Update(x);
    if (goal==0) rt=x;return;
}
int Rank(int x){
    Splay(x,0);return S[S[x].ch[0]].sz+1;
}
int Pre(int x){
    Splay(x,0);x=S[x].ch[0];PushDown(x);
    while (S[x].ch[1]) PushDown(x=S[x].ch[1]);
    Splay(x,0);return x;
}
int Nxt(int x){
    Splay(x,0);x=S[x].ch[1];PushDown(x);
    while (S[x].ch[0]) PushDown(x=S[x].ch[0]);
    Splay(x,0);return x;
}
```