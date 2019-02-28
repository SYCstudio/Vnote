# Alice and Bob
[HDU5841]

As you know, Alice and Bob always play game together, and today they get a tree. 
 The tree consists of $n$ vertices, and vertex $1$ is the root of this tree. 
 There is a number $w[i]$ written on the ith vectex. Alice and Bob want to play a game on a subtree of this tree. (Note that there are only $n$ subtrees, since the tree is rooted.) 
 Firstly Alice will choose a vertex in this subtree, and Bob must to choose a different vertex in this subtree. (So, Bob knows which vertex Alice chosen.) 
 At last they will get a result number equals the XOR sum of the number written on the two vertices which they chosen. 
 But the problem is that Alice wants the result number to be as maximal as possible while Bob wants the result number to be as minimal as possible, and of course they are clever enough. 
  Now we are interested in the result number, can you tell us? 

Trie 树线段树合并。查询的时候有一种情况需要递归下去。

```cpp
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<iostream>
using namespace std;

const int maxN=101000;
const int maxM=maxN<<1;
const int maxB=17;
const int inf=1000000000;

class Trie{
    public:
    int ch[2],cnt,f;
};

int n,edgecnt=-1,Head[maxN],Next[maxM],V[maxM],Val[maxN];
int nodecnt=0,rt[maxN],Ans[maxN],Sz[maxN];
Trie T[maxN*20];

void Add_Edge(int u,int v);
void dfs_init(int u,int fa);
void Modify(int &x,int key,int b);
int Merge(int x,int y,int b);
void Update(int x,int b);
int Query(int x,int key,int b);
int main(){
    int Case=0;scanf("%d",&Case);
    for (int ci=1;ci<=Case;ci++){
        edgecnt=-1;nodecnt=0;memset(Head,-1,sizeof(Head));memset(T,0,sizeof(T));memset(rt,0,sizeof(rt));
        scanf("%d",&n);for (int i=1;i<=n;i++) scanf("%d",&Val[i]);
        for (int i=1;i<n;i++){
            int u,v;scanf("%d%d",&u,&v);
            Add_Edge(u,v);Add_Edge(v,u);
        }
        dfs_init(1,0);
        int Q;scanf("%d",&Q);
        printf("Case #%d:\n",ci);
        while (Q--){
            int u;scanf("%d",&u);printf("%d\n",Ans[u]);
        }
    }
    return 0;
}
void Add_Edge(int u,int v){
    Next[++edgecnt]=Head[u];Head[u]=edgecnt;V[edgecnt]=v;
    return;
}
void dfs_init(int u,int fa){
    Sz[u]=1;Modify(rt[u],Val[u],maxB-1);
    for (int i=Head[u];i!=-1;i=Next[i]) if (V[i]!=fa) dfs_init(V[i],u),Sz[u]+=Sz[V[i]],rt[u]=Merge(rt[u],rt[V[i]],maxB-1);
    Ans[u]=Sz[u]>1?T[rt[u]].f:-1;return;
}
void Modify(int &x,int key,int b){
    if (x==0) x=++nodecnt,T[x].ch[0]=T[x].ch[1]=T[x].f=T[x].cnt=0;++T[x].cnt;
    if (b==-1) return;
    Modify(T[x].ch[(key>>b)&1],key,b-1);Update(x,b);
    return;
}
int Merge(int x,int y,int b){
    if (!x||!y) return x+y;
    if (b==-1){
        T[x].cnt+=T[y].cnt;T[x].f=0;
        return x;
    }
    T[x].ch[0]=Merge(T[x].ch[0],T[y].ch[0],b-1);
    T[x].ch[1]=Merge(T[x].ch[1],T[y].ch[1],b-1);
    Update(x,b);return x;
}
int Query(int x,int key,int b){
    if (b==-1) return 0;
    if (T[x].ch[(key>>b)&1]) return Query(T[x].ch[(key>>b)&1],key,b-1);
    else return Query(T[x].ch[((key>>b)&1)^1],key,b-1)|(1<<b);
}
void Update(int x,int b){
    int ls=T[x].ch[0],rs=T[x].ch[1];
    T[x].cnt=T[ls].cnt+T[rs].cnt;
    if (T[x].cnt==1) T[x].f=(T[ls].cnt?T[ls].f:(T[rs].f|(1<<b)));
    else if (ls==0||rs==0) T[x].f=(ls?T[ls].f:T[rs].f);
    else if (T[ls].cnt==1&&T[rs].cnt==1) T[x].f=(T[ls].f^T[rs].f)|(1<<b);
    else if (T[ls].cnt>1&&T[rs].cnt>1) T[x].f=max(T[ls].f,T[rs].f);
    else T[x].f=(T[ls].cnt==1?((1<<b)|Query(rs,T[ls].f,b-1))
                                    :((1<<b)|Query(ls,T[rs].f,b-1)));
    return;
}
```