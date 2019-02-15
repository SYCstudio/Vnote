# shallot
[BZOJ4184]

小苗去市场上买了一捆小葱苗，她突然一时兴起，于是她在每颗小葱苗上写上一个数字，然后把小葱叫过来玩游戏。  
每个时刻她会给小葱一颗小葱苗或者是从小葱手里拿走一颗小葱苗，并且让小葱从自己手中的小葱苗里选出一些小葱苗使得选出的小葱苗上的数字的异或和最大。  
这种小问题对于小葱来说当然不在话下，但是他的身边没有电脑，于是他打电话给同为Oi选手的你，你能帮帮他吗？  
你只需要输出最大的异或和即可，若小葱手中没有小葱苗则输出0。

每一个数出现的位置是一段连续区间，把它离线下来放到线段树上做，然后线段树整体查询一下，维护线性基求异或最大值。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<map>
#include<vector>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=501000;
const int maxBit=32;
const int inf=2147483647;

class Base
{
public:
	int val[maxBit];
	void Insert(int key){
		for (int i=maxBit-1;i>=0;i--)
			if (key&(1<<i)){
				if (val[i]==0){
					val[i]=key;break;
				}
				key^=val[i];
			}
		return;
	}

	int Get(){
		int ret=0;
		for (int i=maxBit-1;i>=0;i--) ret=max(ret,ret^val[i]);
		return ret;
	}
};

int n;
vector<int> S[maxN<<2];
map<int,int> Pos,Cnt;

void Add(int now,int l,int r,int ql,int qr,int key);
void Query(int now,int l,int r,Base B);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++){
		int key;scanf("%d",&key);
		if (key>0){
			if (Cnt[key]==0) Pos[key]=i;
			Cnt[key]++;
		}
		else{
			key=-key;
			if (Cnt[key]==1){
				Add(1,1,n,Pos[key],i-1,key);
			}
			Cnt[key]--;
		}
	}
	for (map<int,int>::iterator it=Pos.begin();it!=Pos.end();it++)
		if (Cnt[it->first]>0) {
		Add(1,1,n,it->second,n,it->first);
	}

	Base B;mem(B.val,0);
	Query(1,1,n,B);
	return 0;
}

void Add(int now,int l,int r,int ql,int qr,int key){
	if ((l==ql)&&(r==qr)){
		S[now].push_back(key);return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Add(lson,l,mid,ql,qr,key);
	else if (ql>=mid+1) Add(rson,mid+1,r,ql,qr,key);
	else{
		Add(lson,l,mid,ql,mid,key);Add(rson,mid+1,r,mid+1,qr,key);
	}
	return;
}

void Query(int now,int l,int r,Base B){
	for (int sz=S[now].size(),i=0;i<sz;i++) B.Insert(S[now][i]);
	if (l==r){
		printf("%d\n",B.Get());return;
	}
	int mid=(l+r)>>1;
	Query(lson,l,mid,B);Query(rson,mid+1,r,B);
	return;
}
```