# Bearish Fanpages
[CF643D]

There is a social website with n fanpages, numbered 1 through n. There are also n companies, and the i-th company owns the i-th fanpage.  
Recently, the website created a feature called following. Each fanpage must choose exactly one other fanpage to follow.  
The website doesn’t allow a situation where i follows j and at the same time j follows i. Also, a fanpage can't follow itself.  
Let’s say that fanpage i follows some other fanpage j0. Also, let’s say that i is followed by k other fanpages j1, j2, ..., jk. Then, when people visit fanpage i they see ads from k + 2 distinct companies: i, j0, j1, ..., jk. Exactly ti people subscribe (like) the i-th fanpage, and each of them will click exactly one add. For each of k + 1 companies j0, j1, ..., jk, exactly![CF643D-1](_v_images/_cf643d1_1533207147_1004794899.png)people will click their ad. Remaining ![CF643D-2](_v_images/_cf643d2_1533207161_1754932732.png)people will click an ad from company i (the owner of the fanpage).  
The total income of the company is equal to the number of people who click ads from this copmany.  
Limak and Radewoosh ask you for help. Initially, fanpage i follows fanpage fi. Your task is to handle q queries of three types:  
    1 i j — fanpage i follows fanpage j from now. It's guaranteed that i didn't follow j just before the query. Note an extra constraint for the number of queries of this type (below, in the Input section).
    2 i — print the total income of the i-th company.
    3 — print two integers: the smallest income of one company and the biggest income of one company. 

给出$n$个点，每一个点有一条出边到达另一个点。定义每一个点有一个权值$B _ i$，与$i$点距离不超过$1$的点有$D _ i$个，定义$E _ i=\lfloor \frac{B _ i}{D _ i} \rfloor$，$C _ i=B _ i-E _ i \times D _ i+\sum E _ {P _ i}$，现在要求支持：1.更改某一个点的出边;2.询问某一个点的$C _ i$值，询问全局$C _ i$最小值和最大值。

发现修改的时候，会影响其父亲的$D$和$E$，其父亲的$E$的改变又会更改相邻的所有点的$C$，那么除了儿子的$C$不好直接更改外，其它的信息都是可以$O(1)$修改的。那么为了维护儿子的$C$，对于每一个点维护一个其儿子的$C$的集合，修改的时候直接打上全部加的标记，而对于边的修改则把标记继承过来。再在全局维护两个集合方便求最大值和最小值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<set>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define IL inline

const int maxN=101000;
const int inf=2147483647;

int n,Q;
ll A[maxN],B[maxN],C[maxN],D[maxN],E[maxN],Delta[maxN],S[maxN];
multiset<ll> MS[maxN];
multiset<ll> Min,Max;

IL void UpdateE(int u,ll key);
IL void UpdateC(int u,ll key);
IL void UpdateD(int u,ll key);
IL void Add(int u,ll key);
IL void Del(int u,ll key);
IL void Modify(int u,ll key);

int main(){
	scanf("%d%d",&n,&Q);
	for (int i=1;i<=n;i++) scanf("%lld",&B[i]);
	for (int i=1;i<=n;i++) scanf("%lld",&A[i]);

	for (int i=1;i<=n;i++) D[i]+=2,D[A[i]]++;
	for (int i=1;i<=n;i++) E[i]=B[i]/D[i];
	for (int i=1;i<=n;i++) S[A[i]]+=E[i];
	for (int i=1;i<=n;i++) C[i]=B[i]-D[i]*E[i]+S[i]+E[i]+E[A[i]],MS[A[i]].insert(C[i]);
	for (int i=1;i<=n;i++) if (MS[i].empty()==0) Min.insert(*MS[i].begin()),Max.insert(*(--MS[i].end()));

	while (Q--){
		int opt;scanf("%d",&opt);
		if (opt==1){
			int u,w;scanf("%d%d",&u,&w);
			int v=A[u];
			C[u]=C[u]+Delta[v];UpdateC(v,C[v]-E[u]);
			Del(v,C[u]);C[u]=C[u]-E[v];
			UpdateD(v,D[v]-1);UpdateE(v,B[v]/D[v]);

			UpdateD(w,D[w]+1);UpdateE(w,B[w]/D[w]);
			C[u]=C[u]+E[w];
			Add(w,C[u]);UpdateC(w,C[w]+E[u]);
			C[u]=C[u]-Delta[w];
			A[u]=w;
		}
		if (opt==2){
			int p;scanf("%d",&p);
			printf("%lld\n",C[p]+Delta[A[p]]);
		}
		if (opt==3) printf("%lld %lld\n",(*Min.begin()),(*(--Max.end())));
	}

	return 0;
}

IL void UpdateD(int u,ll key){
	UpdateE(u,B[u]/D[u]);
	UpdateC(u,C[u]+D[u]*E[u]);
	D[u]=key;
	UpdateC(u,C[u]-D[u]*E[u]);
	return;
}

IL void UpdateE(int u,ll key){
	UpdateC(A[u],C[A[u]]-E[u]);UpdateC(u,C[u]-E[u]+D[u]*E[u]);
	Modify(u,key-E[u]);
	E[u]=key;
	UpdateC(A[u],C[A[u]]+E[u]);UpdateC(u,C[u]+E[u]-D[u]*E[u]);
	return;
}

IL void UpdateC(int u,ll key){
	Del(A[u],C[u]+Delta[A[u]]);
	C[u]=key;
	Add(A[u],C[u]+Delta[A[u]]);
	return;
}

IL void Add(int u,ll key){
	if (MS[u].empty()==0){
		Min.erase(Min.find(Delta[u]+(*MS[u].begin())));Max.erase(Max.find(Delta[u]+(*(--MS[u].end()))));
	}
	key=key-Delta[u];
	MS[u].insert(key);
	Min.insert(Delta[u]+(*MS[u].begin()));Max.insert(Delta[u]+(*(--MS[u].end())));
	return;
}

void Del(int u,ll key){
	if (MS[u].empty()==0){
		Min.erase(Min.find(Delta[u]+(*MS[u].begin())));Max.erase(Max.find(Delta[u]+(*(--MS[u].end()))));
	}
	key-=Delta[u];
	MS[u].erase(MS[u].find(key));
	if (MS[u].empty()==0){
		Min.insert(Delta[u]+(*MS[u].begin()));Max.insert(Delta[u]+(*(--MS[u].end())));
	}
	return;
}

IL void Modify(int u,ll key){
	if (MS[u].empty()==0){
		Min.erase(Min.find(Delta[u]+(*MS[u].begin())));Max.erase(Max.find(Delta[u]+(*(--MS[u].end()))));
	}
	Delta[u]+=key;
	if (MS[u].empty()==0){
		Min.insert(Delta[u]+(*MS[u].begin()));Max.insert(Delta[u]+(*(--MS[u].end())));
	}
	return;
}
```