# Xor-MST
[CF888G]

给定一个n个节点的完全图，每个节点有个编号ai,节点i和节点j之间边的权值为ai xor aj,求该图的最小生成树的权值和。

考虑  B 算法，即每次找出与当前联通块相连的中最小的边，然后再 Kruscal 地连上这些边。注意到求异或的最小值可以用 Trie 树，那么每次把在相同连通块中的点排在一起，所有联通块连起来构成一个大序列，对这个序列建立前后缀可持久化 Trie 树，然后就可以查询了。  
实际上这个做法比较呆，注意到异或是从高位向低位贪心的，那么可以按照二进制位从高到低分治，对于 0 和 1 之间只需要连接一条边，然后 0,1 内部的边递归下去处理。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<vector>
#include<iostream>
using namespace std;

#define ll long long

const int maxN=202000;
const int maxT=maxN*30*3;
const int inf=2147483647;

int n;
int Key[maxN],Belong[maxN],bcnt=0;
int Seq[maxN],L[maxN],R[maxN];
int Sbp[maxN],Lbp[maxN],Rbp[maxN];
vector<int> V[maxN];
int nodecnt,rt1[maxN],rt2[maxN],son[maxT][2],Id[maxT];
int ecnt,UFS[maxN];
pair<int,pair<int,int> > E[maxN];

void Insert(int &now,int key,int id);
int Query(int now,int key);
int Find(int x);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&Key[i]);
	for (int i=1;i<=n;i++) Seq[i]=i,Belong[i]=i,L[i]=R[i]=i;
	bcnt=n;ll Ans=0;
	while (bcnt>1){
		nodecnt=0;ecnt=0;
		rt1[0]=0;rt2[n+1]=0;
		for (int i=1;i<=n;i++) Insert(rt1[i]=rt1[i-1],Key[Seq[i]],Seq[i]);
		for (int i=n;i>=1;i--) Insert(rt2[i]=rt2[i+1],Key[Seq[i]],Seq[i]);
		for (int i=1;i<=bcnt;i++){
			int id=-1,mn=inf,p;
			for (int j=L[i];j<=R[i];j++){
				if (L[i]!=1){
					p=Query(rt1[L[i]-1],Key[Seq[j]]);
					if ((Key[p]^Key[Seq[j]])<mn) mn=Key[p]^Key[Seq[j]],id=p;
				}
				if (R[i]!=n){
					p=Query(rt2[R[i]+1],Key[Seq[j]]);
					if ((Key[p]^Key[Seq[j]])<mn) mn=Key[p]^Key[Seq[j]],id=p;
				}
			}
			if (id!=-1) E[++ecnt]=make_pair(mn,make_pair(i,Belong[id]));
		}
		sort(&E[1],&E[ecnt+1]);
		for (int i=1;i<=bcnt;i++) UFS[i]=i,V[i].clear();
		for (int i=1;i<=ecnt;i++)
			if (Find(E[i].second.first)!=Find(E[i].second.second)){
				Ans+=E[i].first;
				UFS[Find(E[i].second.first)]=Find(E[i].second.second);
			}
		for (int i=1;i<=bcnt;i++) V[Find(i)].push_back(i);
		int bbcnt=bcnt,pot=0;bcnt=0;
		for (int i=1;i<=bbcnt;i++)
			if (Find(i)==i){
				++bcnt;
				Lbp[bcnt]=pot+1;
				for (int j=0,sz=V[i].size();j<sz;j++)
					for (int k=L[V[i][j]];k<=R[V[i][j]];k++)
						Belong[Sbp[++pot]=Seq[k]]=bcnt;
				Rbp[bcnt]=pot;
			}
		for (int i=1;i<=bcnt;i++) L[i]=Lbp[i],R[i]=Rbp[i];
		for (int i=1;i<=n;i++) Seq[i]=Sbp[i];
	}
	printf("%lld\n",Ans);return 0;
}

void Insert(int &now,int key,int id){
	++nodecnt;son[nodecnt][0]=son[now][0];son[nodecnt][1]=son[now][1];
	now=nodecnt;Id[now]=id;int lst=now;
	for (int i=29;i>=0;i--){
		int c=(key>>i)&1;
		++nodecnt;son[nodecnt][0]=son[son[lst][c]][0];son[nodecnt][1]=son[son[lst][c]][1];
		son[lst][c]=nodecnt;lst=nodecnt;Id[lst]=id;
	}
	return;
}

int Query(int now,int key){
	for (int i=29;i>=0;i--){
		int c=(key>>i)&1;
		if (son[now][c]!=0) now=son[now][c];
		else now=son[now][c^1];
	}
	return Id[now];
}

int Find(int x){
	if (UFS[x]!=x) UFS[x]=Find(UFS[x]);
	return UFS[x];
}
```